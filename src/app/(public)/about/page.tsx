import AboutContent from "./AboutContent";

export const metadata = { title: "About Us" };
export const revalidate = 86400;

export default function AboutPage() {
  return <AboutContent />;
}
