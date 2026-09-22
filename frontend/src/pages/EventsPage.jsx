import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileText,
  IndianRupee,
  Users,
  Zap,
  Monitor,
  Presentation,
} from 'lucide-react';

import Layout from '../components/layout/Layout';

const EVENTS = [
  {
    id: 'paper-preparation',
    name: 'Paper Preparation',
    category: 'Technical',
    description:
      'Present your technical idea with a well-prepared research paper and presentation.',
    mode: 'Online / Offline',
    teamSize: '3 Members',
    onlineFee: 175,
    offlineFee: 600,
    isPpt: true,
  },
  {
    id: 'prompt-battle',
    name: 'Prompt Battle',
    category: 'Technical',
    description:
      'Test your creativity and prompt engineering skills through challenging AI tasks.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'debugging',
    name: 'Debugging',
    category: 'Technical',
    description:
      'Find bugs, understand the logic and fix the code within the given time.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'project-expo',
    name: 'Project Expo',
    category: 'Technical',
    description:
      'Showcase your innovative project and explain your solution to the judges.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'website-creation',
    name: 'Website Creation',
    category: 'Technical',
    description:
      'Create an attractive and functional website based on the given challenge.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'memes-creation',
    name: 'Memes Creation',
    category: 'Non-Technical',
    description:
      'Turn your creativity and sense of humour into engaging technology-themed memes.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'quiz',
    name: 'Quiz',
    category: 'Non-Technical',
    description:
      'Challenge your knowledge with questions covering technology and general topics.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'imposter',
    name: 'Imposter',
    category: 'Non-Technical',
    description:
      'Observe carefully, identify the imposter and prove your deduction skills.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
  {
    id: 'finding-bgm',
    name: 'Finding BGM',
    category: 'Non-Technical',
    description:
      'Identify the background music from the given audio clues.',
    mode: 'Offline',
    teamSize: 'Individual',
    fee: 200,
  },
];

const EventsPage = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState('All');
  const [selectedEvents, setSelectedEvents] = useState([]);

  const filteredEvents = useMemo(() => {
    if (category === 'All') {
      return EVENTS;
    }

    return EVENTS.filter(
      (event) => event.category === category
    );
  }, [category]);

  const isSelected = (eventId) => {
    return selectedEvents.includes(eventId);
  };

  const toggleEvent = (event) => {
    /*
      PPT / Paper Preparation is handled separately.
      User selects PPT first and chooses Online / Offline
      mode inside the registration page.
    */
    if (event.isPpt) {
      setSelectedEvents(['paper-preparation']);
      return;
    }

    /*
      Normal events are grouped under one individual
      registration of ₹200.
    */
    setSelectedEvents((prev) => {
      const withoutPpt = prev.filter(
        (id) => id !== 'paper-preparation'
      );

      if (withoutPpt.includes(event.id)) {
        return withoutPpt.filter(
          (id) => id !== event.id
        );
      }

      return [...withoutPpt, event.id];
    });
  };

  const registerSelected = () => {
    if (selectedEvents.length === 0) {
      return;
    }

    const hasPpt = selectedEvents.includes(
      'paper-preparation'
    );

    navigate('/registration', {
      state: {
        eventIds: selectedEvents,
        registrationType: hasPpt
          ? 'ppt'
          : 'individual',
      },
    });
  };

  const registerSingle = (event) => {
    navigate('/registration', {
      state: {
        event,
        eventIds: [event.id],
        registrationType: event.isPpt
          ? 'ppt'
          : 'individual',
      },
    });
  };

  const normalSelectedCount = selectedEvents.filter(
    (id) => id !== 'paper-preparation'
  ).length;

  const hasPpt = selectedEvents.includes(
    'paper-preparation'
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pb-32">

        {/* ================= HEADER ================= */}
        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Zap
                size={21}
                className="text-red-500"
              />
            </div>

            <span className="text-red-400 text-sm font-semibold uppercase tracking-[0.2em]">
              INFOVERSE 2026
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white">
            Events & Competitions
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl leading-6">
            Choose the events you want to participate in.
            Normal events are covered under one individual
            registration. For Paper Preparation, choose
            Online or Offline mode during registration.
          </p>

        </div>

        {/* ================= FEE INFO ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          {/* NORMAL EVENTS */}
          <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 hover:border-red-500/30 transition">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Users
                  size={20}
                  className="text-red-500"
                />
              </div>

              <h3 className="text-white font-bold">
                Normal Events
              </h3>
            </div>

            <p className="text-gray-400 text-sm leading-6">
              Select any number of normal events under
              one individual registration.
            </p>

            <div className="flex items-center gap-1 mt-4">
              <IndianRupee
                size={18}
                className="text-red-400"
              />

              <span className="text-red-400 text-xl font-black">
                200
              </span>

              <span className="text-gray-500 text-xs ml-1">
                total
              </span>
            </div>

          </div>

          {/* PPT ONLINE */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-5 hover:border-red-500/40 transition">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Monitor
                  size={20}
                  className="text-red-500"
                />
              </div>

              <h3 className="text-white font-bold">
                PPT / Paper
              </h3>
            </div>

            <p className="text-gray-400 text-sm leading-6">
              Submit your Paper Preparation entry
              through online mode.
            </p>

            <div className="flex items-center gap-1 mt-4">
              <IndianRupee
                size={18}
                className="text-red-400"
              />

              <span className="text-red-400 text-xl font-black">
                175
              </span>

              <span className="text-gray-500 text-xs ml-1">
                online
              </span>
            </div>

          </div>

          {/* PPT OFFLINE */}
          <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 hover:border-red-500/30 transition">

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Presentation
                  size={20}
                  className="text-red-500"
                />
              </div>

              <h3 className="text-white font-bold">
                PPT / Paper
              </h3>
            </div>

            <p className="text-gray-400 text-sm leading-6">
              Offline presentation with exactly
              3 members.
            </p>

            <div className="flex items-center gap-1 mt-4">
              <IndianRupee
                size={18}
                className="text-red-400"
              />

              <span className="text-red-400 text-xl font-black">
                600
              </span>

              <span className="text-gray-500 text-xs ml-1">
                3 members
              </span>
            </div>

          </div>

        </div>

        {/* ================= REFERRAL INFO ================= */}
        <div className="mb-8 rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

            <div>
              <p className="text-green-400 text-sm font-bold">
                Referral Code Discount
              </p>

              <p className="text-gray-500 text-xs mt-1">
                Use a valid referral code during registration.
              </p>
            </div>

            <div className="text-green-400 font-black">
              ₹10 OFF
            </div>

          </div>

        </div>

        {/* ================= FILTER ================= */}
        <div className="flex flex-wrap gap-3 mb-7">

          {[
            'All',
            'Technical',
            'Non-Technical',
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                category === item
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        {/* ================= EVENT GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredEvents.map((event, index) => {

            const selected = isSelected(event.id);

            return (
              <div
                key={event.id}
                className={`group relative rounded-2xl border overflow-hidden transition duration-300 ${
                  selected
                    ? 'border-red-500 bg-red-500/[0.07] shadow-lg shadow-red-950/20'
                    : 'border-white/10 bg-black/50 hover:border-red-500/40'
                }`}
              >

                {/* TOP GLOW */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />

                <div className="p-5">

                  {/* NUMBER + CATEGORY */}
                  <div className="flex items-center justify-between mb-5">

                    <span className="text-xs font-bold text-gray-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                        event.category === 'Technical'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      {event.category}
                    </span>

                  </div>

                  {/* ICON */}
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 group-hover:border-red-500/30 transition">

                    {event.isPpt ? (
                      <FileText
                        size={23}
                        className="text-red-500"
                      />
                    ) : (
                      <Zap
                        size={23}
                        className="text-red-500"
                      />
                    )}

                  </div>

                  {/* NAME */}
                  <h2 className="text-xl font-black text-white mb-2">
                    {event.name}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-gray-400 text-sm leading-6 min-h-[72px]">
                    {event.description}
                  </p>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 gap-2 mt-5">

                    <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">

                      <p className="text-gray-600 text-[10px] uppercase">
                        Mode
                      </p>

                      <p className="text-gray-300 text-sm mt-1">
                        {event.isPpt
                          ? 'Online / Offline'
                          : event.mode}
                      </p>

                    </div>

                    <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3">

                      <p className="text-gray-600 text-[10px] uppercase">
                        Participation
                      </p>

                      <p className="text-gray-300 text-sm mt-1">
                        {event.teamSize}
                      </p>

                    </div>

                  </div>

                  {/* FEE */}
                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-xs text-gray-500">
                      Registration Fee
                    </span>

                    <span className="text-red-400 font-bold text-sm">
                      {event.isPpt
                        ? '₹175 Online / ₹600 Offline'
                        : '₹200'}
                    </span>

                  </div>

                  {/* PPT NOTICE */}
                  {event.isPpt && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">

                      <p className="text-red-400 text-xs leading-5">
                        <span className="font-bold">
                          Offline:
                        </span>{' '}
                        exactly 3 members required.
                        Each member can select additional
                        normal events.
                      </p>

                      <p className="text-gray-500 text-[11px] mt-2">
                        Online: ₹175
                      </p>

                      <p className="text-gray-500 text-[11px]">
                        Offline: ₹600 for 3 members
                      </p>

                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-5">

                    <button
                      type="button"
                      onClick={() =>
                        toggleEvent(event)
                      }
                      className={`flex-1 h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition ${
                        selected
                          ? 'bg-red-600 text-white'
                          : 'bg-white/[0.05] border border-white/10 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600'
                      }`}
                    >

                      {selected ? (
                        <>
                          <Check size={17} />
                          Selected
                        </>
                      ) : (
                        'Select Event'
                      )}

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        registerSingle(event)
                      }
                      className="w-11 h-11 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 transition"
                      title="Register"
                    >
                      <ArrowRight size={18} />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* ================= BOTTOM REGISTRATION BAR ================= */}
        {selectedEvents.length > 0 && (

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">

            <div className="rounded-2xl border border-red-500/30 bg-[#090909]/95 backdrop-blur-xl shadow-2xl shadow-black p-4">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* SELECTED INFO */}
                <div>

                  <div className="flex items-center gap-2">

                    <Check
                      size={18}
                      className="text-red-500"
                    />

                    <span className="text-white font-bold">
                      {hasPpt
                        ? 'Paper Preparation Selected'
                        : `${selectedEvents.length} Event${
                            selectedEvents.length > 1
                              ? 's'
                              : ''
                          } Selected`}
                    </span>

                  </div>

                  <p className="text-gray-500 text-xs mt-1">

                    {hasPpt ? (
                      <>
                        Online ₹175 / Offline ₹600
                        • Offline requires 3 members
                      </>
                    ) : (
                      <>
                        {normalSelectedCount} event
                        {normalSelectedCount !== 1
                          ? 's'
                          : ''}{' '}
                        • ₹200 Total
                      </>
                    )}

                  </p>

                </div>

                {/* CONTINUE */}
                <button
                  type="button"
                  onClick={registerSelected}
                  className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition"
                >
                  Continue Registration
                  <ArrowRight size={18} />
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </Layout>
  );
};

export default EventsPage;