import ArticleCard from '~/components/ui/ArticleCard';
import Section from '~/components/ui/Section';

export default function About() {
  return (
    <Section>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>About</h1>
      <ArticleCard className='w-[90vw] sm:w-[36rem] mt-2 p-8 text-3xl text-slate-600'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </ArticleCard>
    </Section>
  );
}
