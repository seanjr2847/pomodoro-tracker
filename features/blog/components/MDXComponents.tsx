import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "tip";
}) {
  const styles = {
    info: "border-blue-500/30 bg-blue-500/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    tip: "border-green-500/30 bg-green-500/5",
  };

  const labels = { info: "Info", warning: "Warning", tip: "Tip" };

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <p className="mb-1 text-sm font-semibold">{labels[type]}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function MDXImage(props: ComponentPropsWithoutRef<typeof Image>) {
  return (
    <Image
      {...props}
      className="my-6 rounded-lg border"
      sizes="(max-width: 768px) 100vw, 768px"
    />
  );
}

export const mdxComponents = {
  Callout,
  Image: MDXImage,
  h2: (props: ComponentPropsWithoutRef<"h2">) => {
    const text = typeof props.children === "string" ? props.children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <h2 id={id} className="mt-10 mb-4 text-2xl font-bold scroll-mt-20" {...props} />;
  },
  h3: (props: ComponentPropsWithoutRef<"h3">) => {
    const text = typeof props.children === "string" ? props.children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return <h3 id={id} className="mt-8 mb-3 text-xl font-semibold scroll-mt-20" {...props} />;
  },
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-4 leading-7 text-muted-foreground" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="font-medium text-primary underline underline-offset-4" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-4 ml-6 list-disc space-y-2" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 border-l-4 border-primary/30 pl-4 italic text-muted-foreground" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="my-6 overflow-x-auto rounded-lg border bg-muted p-4" {...props} />
  ),
};
