import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Clock3,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const categoryStyles = {
  Technology:
    'from-cyan-400/20 to-sky-500/20 border-cyan-400/30 text-cyan-300',
  Sports:
    'from-orange-400/20 to-red-500/20 border-orange-400/30 text-orange-300',
  Politics:
    'from-violet-400/20 to-fuchsia-500/20 border-violet-400/30 text-violet-300',
  Business:
    'from-emerald-400/20 to-green-500/20 border-emerald-400/30 text-emerald-300',
  Entertainment:
    'from-pink-400/20 to-rose-500/20 border-pink-400/30 text-pink-300',
  Health:
    'from-lime-400/20 to-green-500/20 border-lime-400/30 text-lime-300',
  Science:
    'from-blue-400/20 to-indigo-500/20 border-blue-400/30 text-blue-300',
  General:
    'from-slate-400/20 to-slate-500/20 border-slate-400/30 text-slate-300',
};

const NewsCard = ({ article }) => {
  const category =
    article.category || 'General';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -10,
      }}
      transition={{
        duration: 0.4,
      }}
      className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl"
    >
      {/* PREMIUM GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-cyan-400/10 opacity-0 transition duration-700 group-hover:opacity-100" />

      {/* SHINE EFFECT */}
      <div className="absolute -left-40 top-0 h-full w-28 rotate-12 bg-white/10 blur-2xl transition-all duration-1000 group-hover:left-[130%]" />

      {/* IMAGE */}
      <div className="relative overflow-hidden">

        {article.imageUrl ||
        article.urlToImage ? (
          <img
            src={
              article.imageUrl ||
              article.urlToImage
            }
            alt={article.title}
            className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-60 w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">

            <Sparkles
              size={40}
              className="text-slate-600"
            />
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* TOP BADGES */}
        <div className="absolute left-4 top-4 flex items-center gap-2">

          {/* SOURCE */}
          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300">

              {article.source?.name ||
                article.source ||
                'Unknown'}
            </p>
          </div>

          {/* LIVE */}
          <div className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 backdrop-blur-xl">

            <TrendingUp
              size={12}
              className="text-emerald-300"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              Live
            </span>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="absolute bottom-4 left-4">

          <div
            className={`rounded-full border bg-gradient-to-r px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-xl ${categoryStyles[category] || categoryStyles.General}`}
          >
            {category}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative p-6">

        {/* TITLE */}
        <h2 className="line-clamp-2 text-2xl font-black leading-tight text-white transition duration-300 group-hover:text-sky-300">

          {article.title}
        </h2>

        {/* DESCRIPTION */}
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-400">

          {article.description ||
            'Explore premium breaking updates and global stories in real-time.'}
        </p>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

          {/* DATE */}
          <div className="flex items-center gap-2 text-slate-400">

            <Clock3 size={15} />

            <span className="text-xs tracking-wide">

              {article.publishedAt
                ? new Date(
                    article.publishedAt
                  ).toLocaleString()
                : 'Recently updated'}
            </span>
          </div>

          {/* BUTTON */}
          <motion.a
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-sky-500/20 transition-all duration-300 hover:shadow-sky-400/40"
          >
            Read Full Article

            <ExternalLink size={16} />
          </motion.a>
        </div>
      </div>

      {/* BORDER LIGHT */}
      <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/5" />
    </motion.article>
  );
};

export default NewsCard;