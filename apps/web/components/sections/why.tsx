import { Section } from "@/components/site/section";

export function Why() {
  return (
    <Section path="why" title="Three things it gets right.">
      <p className="mt-6 max-w-[62ch] text-paper-muted">
        Tasks and projects are paths. <code className="text-paper">ls</code>{" "}
        lists them, <code className="text-paper">cat</code> shows one,{" "}
        <code className="text-paper">touch</code> makes one,{" "}
        <code className="text-paper">mv</code> moves it,{" "}
        <code className="text-paper">rm</code> retires it. An agent that can use
        a shell can use wrkq with zero instructions, and{" "}
        <code className="text-paper">wrkq info</code> gives it the rest.
      </p>
    </Section>
  );
}
