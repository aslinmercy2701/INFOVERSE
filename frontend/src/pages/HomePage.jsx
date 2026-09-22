import React from 'react';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Trophy,
  Users,
  Code2,
  Palette,
  Brain,
  Globe,
  Zap,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const technicalEvents = [
  {
    title: 'Paper Preparation',
    description:
      'Present your innovative ideas through a well-structured technical paper.',
    icon: Globe,
    tag: 'TECHNICAL',
  },
  {
    title: 'Prompt Battle',
    description:
      'Test your creativity and AI prompting skills through challenging tasks.',
    icon: Brain,
    tag: 'TECHNICAL',
  },
  {
    title: 'Debugging',
    description:
      'Find bugs, solve coding challenges and prove your debugging skills.',
    icon: Code2,
    tag: 'TECHNICAL',
  },
  {
    title: 'Project Expo',
    description:
      'Showcase your innovative projects and explain your technical ideas.',
    icon: Zap,
    tag: 'TECHNICAL',
  },
  {
    title: 'Website Creation',
    description:
      'Design and build a creative website within the given challenge.',
    icon: Globe,
    tag: 'TECHNICAL',
  },
];

const nonTechnicalEvents = [
  {
    title: 'Memes Creation',
    description:
      'Turn your creativity and sense of humour into engaging memes.',
    icon: Palette,
    tag: 'NON-TECHNICAL',
  },
  {
    title: 'Quiz',
    description:
      'Challenge yourself with an exciting quiz covering different topics.',
    icon: Brain,
    tag: 'NON-TECHNICAL',
  },
  {
    title: 'Imposter',
    description:
      'Observe, think and identify the imposter before it is too late.',
    icon: Users,
    tag: 'NON-TECHNICAL',
  },
  {
    title: 'Finding BGM',
    description:
      'Test your music knowledge by identifying the right background music.',
    icon: Sparkles,
    tag: 'NON-TECHNICAL',
  },
];

const EventCard = ({ event }) => {
  const Icon = event.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/65 p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-red-500/40 hover:bg-black/80">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-red-600/10 blur-3xl transition-all duration-500 group-hover:bg-red-600/25" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <Icon size={22} />
          </div>

          <span className="rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 text-[10px] font-bold tracking-widest text-red-400">
            {event.tag}
          </span>
        </div>

        <h3 className="text-xl font-black text-white">
          {event.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          {event.description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-red-400">
          Explore Event
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div
      className="min-h-screen overflow-x-hidden bg-black text-white"
      style={{
        backgroundImage: "url('/infoverse-anime.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* DARK OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-black/75" />

      {/* EXTRA RED GLOW */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-red-900/10 blur-[150px]" />
      </div>

      {/* PAGE CONTENT */}
      <div className="relative z-10">

        {/* ================= NAVBAR ================= */}
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
                <Zap size={20} className="text-white" />
              </div>

              <div>
                <h1 className="text-lg font-black tracking-[0.2em] text-white">
                  INFOVERSE
                </h1>
                <p className="text-[8px] font-bold tracking-[0.25em] text-gray-500">
                  TECH SYMPOSIUM
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#about"
                className="text-sm font-medium text-gray-400 transition hover:text-white"
              >
                About
              </a>

              <a
                href="#events"
                className="text-sm font-medium text-gray-400 transition hover:text-white"
              >
                Events
              </a>

              <a
                href="#why"
                className="text-sm font-medium text-gray-400 transition hover:text-white"
              >
                Why Us
              </a>

              <Link
                to="/register"
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
              >
                Register
              </Link>
            </div>

            <Link
              to="/register"
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold md:hidden"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* ================= HERO ================= */}
        <section className="relative flex min-h-[90vh] items-center justify-center px-5 py-20">
          <div className="mx-auto max-w-5xl text-center">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 text-xs font-bold tracking-[0.2em] text-red-400 backdrop-blur-md">
              <Sparkles size={14} />
              DMI ENGINEERING COLLEGE
            </div>

            <h1 className="text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              INFO
              <span className="text-red-500">VERSE</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base md:text-lg">
              Where technology meets creativity, innovation meets competition,
              and ideas transform into extraordinary experiences.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-gray-300 backdrop-blur-md">
                <CalendarDays size={15} className="text-red-400" />
                09/10/2026
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-gray-300 backdrop-blur-md">
                <Clock3 size={15} className="text-red-400" />
                09:30 AM onwards
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-gray-300 backdrop-blur-md">
                <MapPin size={15} className="text-red-400" />
                Aralvaimozhi
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group flex items-center justify-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-sm font-black shadow-xl shadow-red-600/20 transition hover:bg-red-500"
              >
                REGISTER NOW
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#events"
                className="rounded-2xl border border-white/15 bg-black/40 px-8 py-4 text-sm font-black backdrop-blur-md transition hover:border-red-500/40 hover:bg-white/5"
              >
                EXPLORE EVENTS
              </a>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-6xl">

            {/* CENTER HEADING */}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black tracking-[0.35em] text-red-400">
                ABOUT THE EVENT
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl md:text-6xl">
                Who We Are
              </h2>

              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-red-500" />

              <p className="mt-7 text-sm leading-7 text-gray-400 sm:text-base">
                INFOVERSE is a technical symposium designed to bring together
                students, ideas, creativity and technology under one platform.
                It is a space to learn, compete, create and showcase innovative
                skills.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/60 p-7 text-center backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <Brain size={25} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Innovation
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Think differently and transform ideas into innovative
                  solutions.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/60 p-7 text-center backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <Users size={25} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Collaboration
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Connect with students, share ideas and experience teamwork.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/60 p-7 text-center backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <Trophy size={25} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Competition
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Challenge yourself through exciting technical and creative
                  competitions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= EVENTS ================= */}
        <section id="events" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">

            {/* CENTER HEADING */}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black tracking-[0.35em] text-red-400">
                COMPETE • CREATE • CONQUER
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl md:text-6xl">
                Our Events
              </h2>

              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-red-500" />

              <p className="mt-6 text-sm leading-7 text-gray-400">
                Choose your challenge and showcase what you can do.
              </p>
            </div>

            {/* TECHNICAL */}
            <div className="mt-16">
              <div className="mb-8 text-center">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-black tracking-widest text-red-400">
                  TECHNICAL EVENTS
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {technicalEvents.map((event) => (
                  <EventCard key={event.title} event={event} />
                ))}
              </div>
            </div>

            {/* NON TECHNICAL */}
            <div className="mt-20">
              <div className="mb-8 text-center">
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-black tracking-widest text-red-400">
                  NON-TECHNICAL EVENTS
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {nonTechnicalEvents.map((event) => (
                  <EventCard key={event.title} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY PARTICIPATE ================= */}
        <section id="why" className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-6xl">

            {/* CENTER HEADING */}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black tracking-[0.35em] text-red-400">
                MORE THAN A SYMPOSIUM
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl md:text-6xl">
                Why Participate?
              </h2>

              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-red-500" />
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md">
                <Trophy className="mx-auto text-red-400" size={28} />
                <h3 className="mt-5 font-black">Show Your Skills</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Put your technical and creative abilities into action.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md">
                <Users className="mx-auto text-red-400" size={28} />
                <h3 className="mt-5 font-black">Meet New People</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Connect with students and build new experiences.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md">
                <Zap className="mx-auto text-red-400" size={28} />
                <h3 className="mt-5 font-black">Challenge Yourself</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Step outside your comfort zone and solve exciting
                  challenges.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-center backdrop-blur-md">
                <ShieldCheck className="mx-auto text-red-400" size={28} />
                <h3 className="mt-5 font-black">Create Memories</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Experience a day filled with technology, creativity and fun.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEES ================= */}
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-5xl">

            {/* CENTER HEADING */}
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black tracking-[0.35em] text-red-400">
                REGISTRATION
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                Choose Your Pass
              </h2>

              <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-red-500" />

              <p className="mt-6 text-sm text-gray-400">
                One registration gives you access to your selected events.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">

              {/* NORMAL */}
              <div className="rounded-3xl border border-white/10 bg-black/65 p-7 text-center backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <IndianRupee size={25} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Individual
                </h3>

                <div className="mt-4 text-4xl font-black">
                  ₹200
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  Normal individual registration
                </p>
              </div>

              {/* ONLINE */}
              <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-7 text-center backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <Globe size={25} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  PPT Online
                </h3>

                <div className="mt-4 text-4xl font-black text-red-400">
                  ₹175
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  Team of exactly 3 members
                </p>
              </div>

              {/* OFFLINE */}
              <div className="rounded-3xl border border-white/10 bg-black/65 p-7 text-center backdrop-blur-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <Users size={25} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  PPT Offline
                </h3>

                <div className="mt-4 text-4xl font-black">
                  ₹600
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  Team of exactly 3 members
                </p>
              </div>

            </div>

            <div className="mt-10 text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-sm font-black shadow-xl shadow-red-600/20 transition hover:bg-red-500"
              >
                REGISTER NOW
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-red-500/20 bg-black/70 px-6 py-16 text-center backdrop-blur-xl sm:px-10">

            <Sparkles className="mx-auto text-red-400" size={32} />

            <h2 className="mt-6 text-4xl font-black sm:text-5xl">
              Ready to Enter the
              <span className="text-red-500"> INFOVERSE?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Bring your ideas. Bring your skills. Bring your creativity.
              Make your mark at INFOVERSE 2026.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-sm font-black transition hover:bg-red-500"
            >
              REGISTER NOW
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="border-t border-white/10 bg-black/80 px-5 py-10 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

            <div>
              <h3 className="text-lg font-black tracking-[0.2em]">
                INFO<span className="text-red-500">VERSE</span>
              </h3>

              <p className="mt-2 text-xs text-gray-500">
                DMI Engineering College, Aralvaimozhi
              </p>
            </div>

            <div className="text-xs text-gray-500">
              © 2026 INFOVERSE. All rights reserved.
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
};

export default HomePage;