
import { Welcome } from "../welcome/welcome";
import Header from "~/components/header";
import GradualBlur from "~/components/kits/gradual-blur";
import Description from "~/welcome/description";
import TimeLine from "~/welcome/timeline";
import Footer from "~/components/footer";
import type { Route } from "./+types/home";
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 帮您实现想法" },
    { name: "description", content: "爱开发，帮你实现想法" },
  ];
}

export default function Home() {

  return (
    <main>
      <div id="page-scroll" data-page-scroll className="h-screen overflow-y-auto relative">
        <Header />
        <Welcome />
        <Description />
        <TimeLine />
        <Footer />
      </div>
      {/* <GradualBlur
        target="parent"
        position="bottom"
        height="7rem"
        strength={3.5}
        divCount={4}
        curve="bezier"
        exponential={false}
        opacity={1}
      /> */}

    </main>
  );
}
