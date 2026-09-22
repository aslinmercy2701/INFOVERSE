import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays,
  CreditCard,
  Tag,
  Users,
  ArrowRight,
  Copy,
  Hash,
  IndianRupee,
  Sparkles,
  Monitor,
  Presentation,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Layout from '../components/layout/Layout';

const MyRegistrationPage = () => {
  // Demo data
  // Replace this with backend API data later.
  const registrations = [
    {
      id: 'INF-7K42A9',
      referenceCode: 'INF-7K42A9',

      // Individual | PPT Online | PPT Offline
      registrationType: 'Individual',

      events: [
        {
          name: 'Prompt Battle',
          category: 'Technical',
        },
      ],

      amount: 200,
      discount: 0,
      finalAmount: 200,

      paymentStatus: 'Pending',
      registrationStatus: 'Registered',

      date: '09 Oct 2026',
      registeredOn: '22 Sep 2026',

      mode: 'Offline',

      team: false,
      utr: 'XXXXXXXXXXXX',
    },
  ];

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Reference code copied');
    } catch {
      toast.error('Unable to copy code');
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-red-400">
            <Sparkles size={15} />
            INFOVERSE // REGISTRATION HUB
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            My Registrations
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Track your INFOVERSE registrations, payment verification,
            events and referral information.
          </p>
        </motion.div>


        {/* =================================================
            FEE INFORMATION
        ================================================= */}

        <div className="mb-6 rounded-3xl border border-red-500/20 bg-black/60 p-5 backdrop-blur-xl sm:p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
              <IndianRupee size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Registration Fee Structure
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                INFOVERSE 2026 participation fees
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <FeeInfo
              icon={Users}
              title="Normal Events"
              subtitle="Individual"
              amount="₹200"
              description="Any number of normal events"
            />

            <FeeInfo
              icon={Monitor}
              title="PPT / Paper"
              subtitle="Online"
              amount="₹175"
              description="Online submission"
            />

            <FeeInfo
              icon={Presentation}
              title="PPT / Paper"
              subtitle="Offline"
              amount="₹600"
              description="Exactly 3 members"
            />

          </div>

          <div className="mt-4 rounded-xl border border-green-500/10 bg-green-500/5 px-4 py-3">
            <p className="text-xs text-gray-400">
              Valid referral code:
              <span className="ml-1 font-bold text-green-400">
                ₹10 OFF
              </span>
            </p>
          </div>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <SummaryCard
            icon={FileText}
            label="REGISTRATIONS"
            value={registrations.length}
          />

          <SummaryCard
            icon={CalendarDays}
            label="EVENTS"
            value={registrations.reduce(
              (total, item) => total + item.events.length,
              0
            )}
          />

          <SummaryCard
            icon={IndianRupee}
            label="TOTAL AMOUNT"
            value={`₹${registrations.reduce(
              (total, item) => total + item.finalAmount,
              0
            )}`}
          />

          <SummaryCard
            icon={Clock}
            label="PAYMENT"
            value={
              registrations.some(
                (item) => item.paymentStatus === 'Pending'
              )
                ? 'Pending'
                : 'Verified'
            }
          />

        </div>


        {/* =================================================
            EMPTY / REGISTRATION LIST
        ================================================= */}

        {registrations.length === 0 ? (

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-red-500/20 bg-black/60 p-10 text-center backdrop-blur-xl sm:p-16"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <FileText className="h-9 w-9 text-red-400" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-white">
              No Registrations Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't registered for any INFOVERSE event yet.
              Explore the events and register to participate.
            </p>

            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Explore Events
              <ArrowRight size={17} />
            </Link>
          </motion.div>

        ) : (

          <div className="space-y-5">

            {registrations.map((registration, index) => (
              <RegistrationCard
                key={registration.id}
                registration={registration}
                index={index}
                copyCode={copyCode}
              />
            ))}

          </div>

        )}


        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-red-500/20 bg-black/50 p-5 backdrop-blur-xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-bold text-white">
                Want to participate in another event?
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Select multiple normal events under one ₹200
                individual registration.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
            >
              View Events
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </div>
    </Layout>
  );
};


/* =========================================================
   FEE INFO
========================================================= */

const FeeInfo = ({
  icon: Icon,
  title,
  subtitle,
  amount,
  description,
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">

    <div className="flex items-start justify-between">

      <div>
        <p className="text-sm font-bold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-red-400">
          {subtitle}
        </p>
      </div>

      <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
        <Icon size={17} />
      </div>

    </div>

    <p className="mt-4 text-2xl font-black text-white">
      {amount}
    </p>

    <p className="mt-1 text-xs text-gray-500">
      {description}
    </p>

  </div>
);


/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl transition hover:border-red-500/30">

    <div className="flex items-center justify-between gap-2">

      <div>
        <p className="text-[10px] font-semibold tracking-widest text-gray-500">
          {label}
        </p>

        <p className="mt-2 text-xl font-black text-white">
          {value}
        </p>
      </div>

      <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
        <Icon size={19} />
      </div>

    </div>
  </div>
);


/* =========================================================
   REGISTRATION CARD
========================================================= */

const RegistrationCard = ({
  registration,
  index,
  copyCode,
}) => {

  const paymentPending =
    registration.paymentStatus === 'Pending';

  const paymentVerified =
    registration.paymentStatus === 'Verified';

  const paymentRejected =
    registration.paymentStatus === 'Rejected';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="overflow-hidden rounded-3xl border border-red-500/20 bg-black/65 backdrop-blur-xl"
    >

      {/* HEADER */}

      <div className="border-b border-white/10 p-5 sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <Hash className="h-6 w-6 text-red-400" />
            </div>

            <div>

              <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-500">
                REGISTRATION ID
              </p>

              <h2 className="mt-1 text-xl font-black tracking-wider text-white sm:text-2xl">
                {registration.id}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold text-red-400">
                  {registration.registrationType}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-gray-400">
                  {registration.mode}
                </span>

              </div>

            </div>

          </div>

          <StatusBadge status={registration.paymentStatus} />

        </div>

      </div>


      {/* EVENTS */}

      <div className="p-5 sm:p-6">

        <div className="mb-4 flex items-center gap-2">

          <CalendarDays
            size={18}
            className="text-red-400"
          />

          <h3 className="text-sm font-bold text-white">
            Registered Events
          </h3>

        </div>

        <div className="space-y-2">

          {registration.events.map((event) => (
            <div
              key={event.name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >

              <div>
                <p className="text-sm font-bold text-white">
                  {event.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {event.category}
                </p>
              </div>

              <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-semibold text-red-400">
                Registered
              </span>

            </div>
          ))}

        </div>

      </div>


      {/* INFO GRID */}

      <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-5 sm:grid-cols-4 sm:p-6">

        <Info
          icon={CalendarDays}
          label="EVENT DATE"
          value={registration.date}
        />

        <Info
          icon={CreditCard}
          label="BASE AMOUNT"
          value={`₹${registration.amount}`}
        />

        <Info
          icon={Tag}
          label="DISCOUNT"
          value={
            registration.discount > 0
              ? `₹${registration.discount}`
              : '₹0'
          }
          green={registration.discount > 0}
        />

        <Info
          icon={IndianRupee}
          label="FINAL AMOUNT"
          value={`₹${registration.finalAmount}`}
          highlight
        />

      </div>


      {/* REFERRAL */}

      <div className="border-t border-white/10 p-5 sm:p-6">

        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Tag
                  size={15}
                  className="text-red-400"
                />

                <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-500">
                  REFERRAL / REFERENCE CODE
                </p>

              </div>

              <p className="mt-2 text-xl font-black tracking-[0.15em] text-red-400">
                {registration.referenceCode}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Share this code with another participant.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                copyCode(registration.referenceCode)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-gray-300 transition hover:border-red-500/30 hover:text-white"
            >
              <Copy size={15} />
              Copy Code
            </button>

          </div>

        </div>

      </div>


      {/* TEAM */}

      {registration.team && (
        <div className="border-t border-white/10 p-5 sm:p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
              <Users size={19} />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Team Registration
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This registration contains team members.
              </p>
            </div>

          </div>

        </div>
      )}


      {/* PAYMENT STATUS */}

      <div className="border-t border-white/10 bg-black/30 p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div
              className={`rounded-xl p-3 ${
                paymentVerified
                  ? 'bg-green-500/10'
                  : paymentRejected
                  ? 'bg-red-500/10'
                  : 'bg-yellow-500/10'
              }`}
            >

              {paymentVerified && (
                <CheckCircle
                  size={20}
                  className="text-green-400"
                />
              )}

              {paymentPending && (
                <Clock
                  size={20}
                  className="text-yellow-400"
                />
              )}

              {paymentRejected && (
                <XCircle
                  size={20}
                  className="text-red-400"
                />
              )}

            </div>

            <div>

              <p className="text-sm font-bold text-gray-200">
                Payment {registration.paymentStatus}
              </p>

              <p className="mt-1 text-xs text-gray-600">

                {paymentPending &&
                  'Waiting for admin verification'}

                {paymentVerified &&
                  'Payment verified successfully'}

                {paymentRejected &&
                  'Payment was rejected'}

              </p>

            </div>

          </div>


          <div className="sm:text-right">

            <p className="text-[10px] font-semibold tracking-widest text-gray-600">
              FINAL AMOUNT
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              ₹{registration.finalAmount}
            </p>

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="border-t border-white/10 px-5 py-4 sm:px-6">

        <div className="flex flex-col gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Registered on {registration.registeredOn}
          </span>

          <span>
            INFOVERSE 2026 • DMI Engineering College
          </span>

        </div>

      </div>

    </motion.div>
  );
};


/* =========================================================
   INFO ITEM
========================================================= */

const Info = ({
  icon: Icon,
  label,
  value,
  highlight = false,
  green = false,
}) => (

  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">

    <Icon
      size={16}
      className={
        green
          ? 'text-green-400'
          : 'text-red-400'
      }
    />

    <p className="mt-3 text-[9px] font-semibold tracking-widest text-gray-600">
      {label}
    </p>

    <p
      className={`mt-1 text-sm font-bold ${
        highlight
          ? 'text-red-400'
          : green
          ? 'text-green-400'
          : 'text-white'
      }`}
    >
      {value}
    </p>

  </div>
);


/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {

  const styles = {
    Pending:
      'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',

    Verified:
      'border-green-500/20 bg-green-500/10 text-green-400',

    Rejected:
      'border-red-500/20 bg-red-500/10 text-red-400',
  };

  const icons = {
    Pending: Clock,
    Verified: CheckCircle,
    Rejected: XCircle,
  };

  const Icon = icons[status] || Clock;

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
};


export default MyRegistrationPage;