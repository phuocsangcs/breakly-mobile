package com.breakly.client;

import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamReader;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.breakly.common.AppException;
import com.breakly.common.ErrorCode;

// Lightweight RSS 2.0 client & parser (VnExpress feeds) using JDK StAX with XXE disabled.
@Component
public class RssClient {

    public record Article(
            String id,
            String title,
            String summary,
            String imageUrl,
            String link,
            String source,
            Instant publishedAt) {
    }

    private static final Pattern IMG_SRC = Pattern.compile("<img[^>]+src=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);
    private static final Pattern HTML_TAG = Pattern.compile("<[^>]+>");

    private final RestClient http;
    private final XMLInputFactory xmlFactory;

    public RssClient(RestClient externalRestClient) {
        this.http = externalRestClient;
        XMLInputFactory f = XMLInputFactory.newInstance();
        f.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);
        f.setProperty(XMLInputFactory.SUPPORT_DTD, false);
        this.xmlFactory = f;
    }

    public List<Article> fetchFeed(String feedUrl, String sourceName, int maxItems) {
        String xml;
        try {
            xml = http.get().uri(feedUrl).retrieve().body(String.class);
        } catch (RestClientException e) {
            throw new AppException(ErrorCode.UPSTREAM_UNAVAILABLE, "News feed unavailable", e);
        }
        if (xml == null || xml.isBlank()) {
            return List.of();
        }
        return parse(xml, sourceName, maxItems);
    }

    List<Article> parse(String xml, String sourceName, int maxItems) {
        List<Article> out = new ArrayList<>();
        try {
            XMLStreamReader r = xmlFactory.createXMLStreamReader(new StringReader(xml));
            boolean inItem = false;
            String title = null, link = null, desc = null, pubDate = null, enclosureImg = null;
            while (r.hasNext() && out.size() < maxItems) {
                int ev = r.next();
                if (ev == XMLStreamConstants.START_ELEMENT) {
                    String tag = r.getLocalName();
                    if ("item".equalsIgnoreCase(tag)) {
                        inItem = true;
                        title = link = desc = pubDate = enclosureImg = null;
                    } else if (inItem) {
                        switch (tag.toLowerCase()) {
                            case "title" -> title = r.getElementText().trim();
                            case "link" -> link = r.getElementText().trim();
                            case "description" -> desc = r.getElementText();
                            case "pubdate" -> pubDate = r.getElementText().trim();
                            case "enclosure" -> {
                                String type = r.getAttributeValue(null, "type");
                                if (type == null || type.startsWith("image")) {
                                    enclosureImg = r.getAttributeValue(null, "url");
                                }
                            }
                        }
                    }
                } else if (ev == XMLStreamConstants.END_ELEMENT && "item".equalsIgnoreCase(r.getLocalName())) {
                    inItem = false;
                    if (title != null && link != null && !link.isBlank()) {
                        String img = enclosureImg != null ? enclosureImg : extractImage(desc);
                        out.add(new Article(shortId(link), decodeEntities(title), cleanSummary(desc),
                                img, link, sourceName, parseDate(pubDate)));
                    }
                }
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.UPSTREAM_UNAVAILABLE, "Failed to parse news feed", e);
        }
        return out;
    }

    private static String extractImage(String html) {
        if (html == null) return null;
        Matcher m = IMG_SRC.matcher(html);
        return m.find() ? m.group(1) : null;
    }

    private static String cleanSummary(String html) {
        if (html == null) return "";
        return decodeEntities(HTML_TAG.matcher(html).replaceAll(" ")).replaceAll("\\s+", " ").trim();
    }

    private static String decodeEntities(String s) {
        return s.replace("&amp;", "&").replace("&quot;", "\"").replace("&#39;", "'")
                .replace("&apos;", "'").replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ");
    }

    private static Instant parseDate(String raw) {
        if (raw == null || raw.isBlank()) return Instant.now();
        try {
            return ZonedDateTime.parse(raw, DateTimeFormatter.RFC_1123_DATE_TIME).toInstant();
        } catch (Exception e) {
            return Instant.now();
        }
    }

    private static String shortId(String link) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(link.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d, 0, 8);
        } catch (Exception e) {
            return Integer.toHexString(link.hashCode());
        }
    }
}

