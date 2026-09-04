import type { Metadata } from "next";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

export const metadata: Metadata = {
  title: "Command reference — wrkq",
  description:
    "Every wrkq command, its usage line and its flags, generated from the CLI's own help output.",
};

export default function CommandsPage() {
  return (
    <>
      <Nav />
      <main>
        <div className="mx-auto max-w-(--container-page) px-(--page-gutter) pt-20 pb-(--section-pad)">
          <h1 className="font-display text-3xl leading-[1.05] font-semibold tracking-[-0.02em] text-paper [font-variation-settings:'wdth'_92] sm:text-4xl">
            Command reference
          </h1>
          <p className="mt-6 max-w-[62ch] text-paper-muted">
            Every wrkq command with its usage line and flags, generated at build
            time from the CLI&rsquo;s own <code className="text-paper">--help</code>{" "}
            output. Nothing here is written by hand, so it cannot drift from the
            binary you installed.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
