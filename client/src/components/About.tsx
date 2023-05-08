import ArticleCard from '~/components/ui/ArticleCard';
import Section from '~/components/ui/Section';

export default function About() {
  return (
    <Section className='w-[80vw] max-w-3xl mx-auto mb-8'>
      <h1 className='text-5xl text-slate-800 font-bold py-6'>About</h1>
      <ArticleCard className='mt-2 px-8 py-6 sm:px-16 sm:py-12 text-slate-600'>
        <h2 className='text-4xl text-justify font-bold text-slate-700'>
          New message paradigm to prevent verbal violence on the Internet in
          modern society, chat-gpt filtering
        </h2>
        <ArticleCard className='mt-12 p-4 sm:p-6 md:p-8 bg-slate-300'>
          <ul className='flex flex-col text-3xl text-center gap-3'>
            <li>Sophisticated filtering</li>
            <li>Context understanding</li>
            <li>Support for multiple languages</li>
            <li>Real-time adaptation</li>
          </ul>
        </ArticleCard>
      </ArticleCard>
    </Section>
  );
}
