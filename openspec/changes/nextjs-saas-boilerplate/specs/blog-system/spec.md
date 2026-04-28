## ADDED Requirements

### Requirement: MDX blog post storage
Blog posts SHALL be stored as MDX files in `content/blog/` directory with frontmatter containing title, description, date, tags, image (optional), and published (boolean).

#### Scenario: New blog post creation
- **WHEN** a new `.mdx` file is added to `content/blog/`
- **THEN** it SHALL appear in the blog list after rebuild (if `published: true`)

#### Scenario: Unpublished post
- **WHEN** a post has `published: false`
- **THEN** it SHALL NOT appear in the blog list or sitemap

### Requirement: Blog list page
The system SHALL provide a blog list page at `/blog` displaying published posts as a card grid sorted by date (newest first).

#### Scenario: Blog list rendering
- **WHEN** user navigates to `/blog`
- **THEN** the page SHALL display cards with thumbnail, title, date, and tags for each published post

#### Scenario: Tag filtering
- **WHEN** user selects a tag filter
- **THEN** only posts matching that tag SHALL be displayed

### Requirement: Blog post detail page
The system SHALL provide a detail page at `/blog/[slug]` with MDX rendering, auto-generated table of contents (h2/h3), and previous/next navigation.

#### Scenario: Post with table of contents
- **WHEN** a post contains h2 and h3 headings
- **THEN** a table of contents SHALL be auto-generated from those headings

#### Scenario: Post OG image with frontmatter image
- **WHEN** a post has `image` in frontmatter
- **THEN** that image SHALL be used as the OG image for the post

#### Scenario: Post OG image without frontmatter image
- **WHEN** a post does not have `image` in frontmatter
- **THEN** `/api/og?title={post title}` SHALL be used as the OG image

### Requirement: MDX custom components
The system SHALL provide custom MDX components: Callout (info/warning/tip boxes), CodeBlock (syntax highlighting via rehype-pretty-code), and Image (Next.js Image wrapper).

#### Scenario: Code block rendering
- **WHEN** a post contains a fenced code block
- **THEN** it SHALL render with syntax highlighting via rehype-pretty-code (shiki-based)

### Requirement: SEO integration
Each blog post SHALL have auto-generated metadata (title, description, openGraph) and JSON-LD Article structured data. All published posts SHALL be included in the sitemap.

#### Scenario: Blog post metadata
- **WHEN** a blog post page renders
- **THEN** meta tags SHALL include title, description, and og:image from frontmatter

### Requirement: Example post
The boilerplate SHALL include one example post at `content/blog/hello-world.mdx` demonstrating frontmatter, headings, code blocks, and custom components.

#### Scenario: Example post exists
- **WHEN** the boilerplate is cloned
- **THEN** `content/blog/hello-world.mdx` SHALL exist and render correctly at `/blog/hello-world`
