import PageBanner from "@/components/common/PageBanner";
import FAQ from "@/components/FAQ";

const page = () => {
  return (
    <main>
      <PageBanner title="الاسئلة الشائعة" href="/faq" />
      <FAQ />
    </main>
  );
};

export default page;
