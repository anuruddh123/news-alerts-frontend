import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing,
  Sparkles,
  Globe2,
  TrendingUp,
  Newspaper,
  Activity,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import NewsCard from '../components/NewsCard';

const categories = [
  'Politics',
  'Sports',
  'Technology',
  'Business',
  'Entertainment',
  'Health',
  'Science',
];

const DashboardPage = () => {
  const { api, user, notifications } = useAuth();

  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState('Technology');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const fetchNews = async (
    category
  ) => {

    setLoading(true);
    setError('');

    try {

      const { data } =
        await api.get('/news', {
          params: {
            category,
          },
        });

      const updatedArticles =
        (
          data.articles || []
        ).map((article) => ({
          ...article,
          category,
        }));

      setArticles(
        updatedArticles
      );

    } catch (err) {

      setError(
        'Unable to load news feed.'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchNews(
      selectedCategory
    );

    const handleUpdate = (
      event
    ) => {

      setArticles(
        event.detail
      );
    };

    window.addEventListener(
      'newsUpdate',
      handleUpdate
    );

    return () =>
      window.removeEventListener(
        'newsUpdate',
        handleUpdate
      );

  }, [selectedCategory]);

  const latestAlert =
    notifications?.[0];

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">

      {/* Background Effects */}
      <div className="absolute left-[-100px] top-[-100px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-100px] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">

        {/* TOP HERO */}
        <motion.section
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="overflow-hidden rounded-[2.5rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.8)]"
        >
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">

            {/* LEFT */}
            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-sky-300">
                <Sparkles size={14} />
                Live Dashboard
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
                Welcome back,
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {' '}
                  {user?.name}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                Stay updated with real-time headlines,
                breaking alerts, and trending stories
                from around the world.
              </p>

              {/* CATEGORY PILLS */}
              <div className="mt-6 flex flex-wrap gap-3">

                {categories.map(
                  (category) => (

                    <motion.button
                      whileTap={{
                        scale: 0.95,
                      }}
                      whileHover={{
                        scale: 1.05,
                      }}
                      key={category}
                      onClick={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                        selectedCategory ===
                        category
                          ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 shadow-lg shadow-sky-500/30'
                          : 'border border-slate-700 bg-slate-900/60 text-slate-300 hover:border-sky-500 hover:text-white'
                      }`}
                    >
                      {category}
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* RIGHT STATS */}
            <div className="grid w-full gap-4 sm:grid-cols-3 xl:w-[380px] xl:grid-cols-1">

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="rounded-3xl border border-slate-800 bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">

                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </p>

                  <Activity
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <h2 className="mt-4 text-3xl font-bold text-white">
                  Live
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Real-time updates enabled
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="rounded-3xl border border-slate-800 bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">

                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Category
                  </p>

                  <Globe2
                    size={20}
                    className="text-sky-400"
                  />
                </div>

                <h2 className="mt-4 truncate text-2xl font-bold text-white">
                  {selectedCategory}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Personalized news feed
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -5,
                }}
                className="rounded-3xl border border-slate-800 bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">

                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    Articles
                  </p>

                  <Newspaper
                    size={20}
                    className="text-cyan-400"
                  />
                </div>

                <h2 className="mt-4 text-3xl font-bold text-white">
                  {articles.length}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Fresh headlines loaded
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ALERT CARD */}
        <AnimatePresence>

          {latestAlert && (

            <motion.section
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="relative overflow-hidden rounded-[2rem] border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-slate-900 to-cyan-500/10 p-6 backdrop-blur-xl"
            >
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/20">
                    <BellRing size={28} />
                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-[0.35em] text-sky-300">
                      Breaking Alert
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {latestAlert.title}
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                      {latestAlert.description ||
                        'New live alert received.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300">
                  <TrendingUp
                    size={16}
                    className="text-emerald-400"
                  />
                  Live Update
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* NEWS GRID */}
        <section className="space-y-6">

          {loading ? (

            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-800 bg-slate-900/70 p-16 text-center">

              <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" />

              <p className="mt-5 text-slate-400">
                Fetching latest headlines...
              </p>
            </div>

          ) : error ? (

            <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-10 text-center text-rose-200">
              {error}
            </div>

          ) : articles.length === 0 ? (

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-400">
              No news available right now.
            </div>

          ) : (

            <motion.div
              layout
              className="grid gap-7 md:grid-cols-2 xl:grid-cols-3"
            >
              {articles.map(
                (
                  article,
                  index
                ) => (

                  <motion.div
                    key={
                      article.url ||
                      index
                    }
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                  >
                    <NewsCard
                      article={
                        article
                      }
                    />
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;