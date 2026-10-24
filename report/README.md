# Breakly Report Build

The report uses XeLaTeX so Vietnamese names and other Unicode text compile without manual accent mappings.

## Requirements

- TeX Live with `xelatex`, `latexmk`, and `biber`
- The `graphicx`, `fontspec`, `tikz`, `longtable`, `booktabs`, and related LaTeX packages used by the report

## Build

From this directory:

```sh
make build
```

The generated PDF and intermediate files are written to `build/`. The completed
PDF is also copied to `report.pdf` for the existing editor preview.

The workspace includes a LaTeX Workshop recipe that runs `make build`, including
Biber and the subsequent LaTeX passes needed to resolve numbered citations.
Use **Build LaTeX project** from the command palette. A standalone XeLaTeX pass
does not process the bibliography and can produce unresolved citation keys.

Useful commands:

```sh
make clean
make view
```

The source entry point is `report.tex`. The title page assets are under
`graphics/bia/`. Front matter is organized under `frontmatter/`, each
numbered chapter has its own folder under `chapters/`, and closing sections
are under `backmatter/`.

```text
chapters/
  chapter-1-introduction-requirements/
  chapter-2-system-analysis/
  chapter-3-design/
  chapter-4-implementation-testing/
  chapter-5-demonstration/
backmatter/
```

## Project outline

The report is organised around the assessment criteria. Each chapter must
contain the evidence listed below rather than only a narrative description.

### Chapter 1 -- Introduction and Requirement Specification

- Project context: domain context, related apps, system overview,
  stakeholders, and personas.
- Requirements: user requirements, functional requirements, and
  non-functional requirements.

### Chapter 2 -- System Analysis

- Use case analysis.
- Technology stack, including front end and back end.

### Chapter 3 -- Design

- System architecture, sitemap design, sequence diagrams, database design,
  API design, and UI/UX design.

### Chapter 4 -- Implementation and Testing

- Implementation and deployment details.
- Testing evidence and requirement traceability.

### Chapter 5 -- Demonstration

- Basic flow and additional demonstration flows.

### Closing sections

- Conclusion and Future Work.
- AI Usage Declaration.

### Appendices

Include the interview/survey instruments and results, competitor-analysis
notes, detailed use-case specifications, full API examples, prototype link or
screenshots, and any supplementary diagrams that would interrupt the main
chapters.
