import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Ticket,
  Clock3,
  CreditCard,
  ArrowRight,
  Sparkles,
  Code2,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  Zap,
  Monitor,
  Presentation,
  IndianRupee,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Events',
      value: '09',
      icon: CalendarDays,
      text: 'Events available',
    },
    {
      title: 'My Registrations',
      value: '00',
      icon: Ticket,
      text: 'Your registrations',
    },
    {
      title: 'Payment Status',
      value: 'Pending',
      icon: CreditCard,
      text: 'Awaiting verification',
    },
    {
      title: 'Event Date',
      value: '09 Oct',
      icon: Clock3,
      text: '09:30 AM onwards',
    },
  ];

  const technicalEvents = [
    'Paper Preparation',
    'Prompt Battle',
    'Debugging',
    'Project Expo',
    'Website Creation',
  ];

  const nonTechnicalEvents = [
    'Memes Creation',
    'Quiz',
    'Imposter',
    'Finding BGM',
  ];

  return (
    <Layout>
      <div className="min-h-screen text-white">

        {/* HERO */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-red-500/20 bg-black/60 p-6 backdrop-blur-xl sm:p-8 lg:p-10">

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-900/20 blur-3xl" />

          <div className="relative z-10">

            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-400">
              <Sparkles size={17} />
              INFOVERSE 2026
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back,
              <span className="text-red-500">
                {' '}
                {user?.name || 'Participant'}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Get ready for INFOVERSE — a futuristic technical and
              non-technical symposium by the Department of Information
              Technology, DMI Engineering College.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold shadow-lg shadow-red-600/20 transition hover:bg-red-500"
              >
                Explore Events
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/registration"
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-white/5 px-5 py-3 font-semibold transition hover:bg-red-500/10"
              >
                Register Now
                <Ticket size={17} />
              </Link>

            </div>

          </div>
        </section>


        {/* EVENT INFO */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <InfoCard
            icon={CalendarDays}
            title="DATE"
            value="09/10/2026"
          />

          <InfoCard
            icon={Clock3}
            title="TIME"
            value="09:30 AM onwards"
          />

          <InfoCard
            icon={Users}
            title="VENUE"
            value="DMI Engineering College"
          />

        </section>


        {/* STATS */}
        <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl transition hover:border-red-500/40"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      {stat.title}
                    </p>

                    <h3 className="mt-2 text-xl font-black sm:text-2xl">
                      {stat.value}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {stat.text}
                    </p>

                  </div>

                  <div className="rounded-xl bg-red-500/10 p-3 text-red-500 transition group-hover:bg-red-500/20">
                    <Icon size={20} />
                  </div>

                </div>

              </div>
            );
          })}

        </section>


        {/* REGISTRATION FEE */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-red-500/20 bg-black/60 backdrop-blur-xl">

          <div className="border-b border-white/10 p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <IndianRupee size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Registration Fees
                </h2>

                <p className="text-xs text-gray-500">
                  Choose your participation type
                </p>
              </div>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 sm:p-6">

            {/* NORMAL EVENTS */}
            <FeeCard
              icon={Ticket}
              title="Normal Events"
              subtitle="Individual Registration"
              amount="₹200"
              description="Register for any number of normal events under one individual registration."
            />

            {/* PPT ONLINE */}
            <FeeCard
              icon={Monitor}
              title="PPT / Paper"
              subtitle="Online Mode"
              amount="₹175"
              description="Online PPT / Paper Preparation registration."
              highlighted
            />

            {/* PPT OFFLINE */}
            <FeeCard
              icon={Presentation}
              title="PPT / Paper"
              subtitle="Offline Mode"
              amount="₹600"
              description="Offline PPT / Paper team registration for exactly 3 members."
              team
            />

          </div>

          <div className="border-t border-white/10 px-5 py-4 sm:px-6">

            <div className="flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">

              <span>
                Referral code discount: <strong className="text-green-400">₹10 OFF</strong>
              </span>

              <span>
                Valid referral code can be used once per registration.
              </span>

            </div>

          </div>

        </section>


        {/* EVENTS */}
        <section className="mb-6 grid gap-6 lg:grid-cols-2">

          {/* TECHNICAL */}
          <EventList
            title="Technical Events"
            subtitle="Show your technical skills"
            count="05 Events"
            icon={Code2}
            events={technicalEvents}
            startNumber={1}
            itemIcon={Zap}
          />

          {/* NON TECHNICAL */}
          <EventList
            title="Non-Technical Events"
            subtitle="Fun, creativity & challenge"
            count="04 Events"
            icon={Trophy}
            events={nonTechnicalEvents}
            startNumber={6}
            itemIcon={Sparkles}
          />

        </section>


        {/* REGISTRATION STATUS */}
        <section className="mb-6 rounded-2xl border border-red-500/20 bg-black/60 p-5 backdrop-blur-xl sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <AlertCircle
                  size={18}
                  className="text-yellow-400"
                />

                <h2 className="font-bold">
                  Registration Status
                </h2>

              </div>

              <p className="text-sm text-gray-400">
                You haven't completed any registration yet.
              </p>

            </div>

            <Link
              to="/registration"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
            >
              Start Registration
              <ArrowRight size={17} />
            </Link>

          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section>

          <h2 className="mb-4 text-lg font-bold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <QuickAction
              to="/events"
              icon={CalendarDays}
              title="Browse Events"
              text="View all INFOVERSE events"
            />

            <QuickAction
              to="/registration"
              icon={Ticket}
              title="Register"
              text="Register for your favourite events"
            />

            <QuickAction
              to="/my-registration"
              icon={CheckCircle2}
              title="My Registrations"
              text="Track your registration status"
            />

          </div>

        </section>


        {/* FOOTER */}
        <div className="py-10 text-center">

          <p className="text-2xl font-black tracking-[0.25em] text-white/10 sm:text-3xl">
            INFOVERSE
          </p>

          <p className="mt-2 text-xs text-gray-600">
            DMI Engineering College • Department of Information Technology
          </p>

        </div>

      </div>
    </Layout>
  );
};


/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl border border-red-500/20 bg-black/60 p-5 backdrop-blur-xl">

    <div className="flex items-center gap-3">

      <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
        <Icon size={22} />
      </div>

      <div>

        <p className="text-xs uppercase tracking-wider text-gray-500">
          {title}
        </p>

        <p className="text-lg font-bold">
          {value}
        </p>

      </div>

    </div>

  </div>
);


/* =========================================================
   FEE CARD
========================================================= */

const FeeCard = ({
  icon: Icon,
  title,
  subtitle,
  amount,
  description,
  highlighted = false,
  team = false,
}) => (
  <div
    className={`rounded-2xl border p-5 transition ${
      highlighted
        ? 'border-red-500/40 bg-red-500/[0.06]'
        : 'border-white/10 bg-white/[0.025]'
    }`}
  >

    <div className="flex items-start justify-between">

      <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
        <Icon size={20} />
      </div>

      {highlighted && (
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-400">
          ONLINE
        </span>
      )}

      {team && (
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold text-gray-400">
          3 MEMBERS
        </span>
      )}

    </div>

    <p className="mt-5 text-sm font-bold text-white">
      {title}
    </p>

    <p className="mt-1 text-xs text-gray-500">
      {subtitle}
    </p>

    <p className="mt-3 text-3xl font-black text-red-400">
      {amount}
    </p>

    <p className="mt-3 text-xs leading-5 text-gray-500">
      {description}
    </p>

  </div>
);


/* =========================================================
   EVENT LIST
========================================================= */

const EventList = ({
  title,
  subtitle,
  count,
  icon: HeaderIcon,
  events,
  startNumber,
  itemIcon: ItemIcon,
}) => (
  <div className="overflow-hidden rounded-2xl border border-red-500/20 bg-black/60 backdrop-blur-xl">

    <div className="flex items-center justify-between border-b border-white/10 p-5">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
          <HeaderIcon size={21} />
        </div>

        <div>

          <h2 className="text-lg font-bold">
            {title}
          </h2>

          <p className="text-xs text-gray-500">
            {subtitle}
          </p>

        </div>

      </div>

      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
        {count}
      </span>

    </div>

    <div className="space-y-2 p-4">

      {events.map((event, index) => (
        <div
          key={event}
          className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/5"
        >

          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-400">
            {String(startNumber + index).padStart(2, '0')}
          </span>

          <span className="flex-1 text-sm text-gray-300">
            {event}
          </span>

          <ItemIcon
            size={15}
            className="text-red-500"
          />

        </div>
      ))}

    </div>

  </div>
);


/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({
  to,
  icon: Icon,
  title,
  text,
}) => (
  <Link
    to={to}
    className="group rounded-2xl border border-white/10 bg-black/60 p-5 transition hover:border-red-500/40"
  >

    <Icon
      className="mb-3 text-red-500"
      size={23}
    />

    <h3 className="font-bold">
      {title}
    </h3>

    <p className="mt-1 text-xs text-gray-500">
      {text}
    </p>

    <ArrowRight
      size={17}
      className="mt-4 text-gray-500 transition group-hover:text-red-500"
    />

  </Link>
);


export default DashboardPage;