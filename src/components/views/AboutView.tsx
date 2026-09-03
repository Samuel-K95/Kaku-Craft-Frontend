// ============================================================================
// 13. components/views/AboutView.tsx
// ============================================================================
import React from 'react';
import Image from 'next/image';

export const AboutView: React.FC = () => {
  return (
    <main className="py-16 px-6 md:px-12 max-w-4xl mx-auto min-h-screen space-y-16">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4A373]">Manifesto</span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#2C302E]">The Philosophy of Slow Stitches</h1>
        <div className="w-16 h-0.5 bg-[#D4A373] mx-auto mt-6" />
      </div>

      <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-lg">
        <Image 
          src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop"
          alt="Hands crocheting with wooden hooks"
          fill
          sizes="(max-width: 1200px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <div className="prose prose-lg text-[#2C302E]/80 space-y-6 font-sans leading-relaxed text-sm md:text-base">
        <p>
          Founded in Addis Ababa, <strong>Kaku Craft</strong> is an experimental textile studio committed to preserving the meditative art of manual crochet while re-interpreting it through contemporary silhouettes and architectural garment forms.
        </p>
        <p>
          Unlike industrial knitting looms, true crochet stitches cannot be synthesized by automated machinery. Every single spiral, loop, and tension-pull is an irreproducible human gesture. When you wear a Kaku Craft creation, you are wearing hours of focused human patience.
        </p>
        <blockquote className="font-serif text-2xl md:text-3xl text-[#2C302E] italic border-l-4 border-[#D4A373] pl-6 my-8">
          &ldquo;To knit is to craft structure; to crochet is to sculpt emotion stitch by stitch.&rdquo;
        </blockquote>
      </div>
    </main>
  );
};