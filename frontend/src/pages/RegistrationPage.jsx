import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  IndianRupee,
  Upload,
  Users,
  X,
  Zap,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EVENTS = [
  {
    id: 'paper-preparation',
    name: 'Paper Preparation',
    category: 'Technical',
    isPpt: true,
  },
  {
    id: 'prompt-battle',
    name: 'Prompt Battle',
    category: 'Technical',
  },
  {
    id: 'debugging',
    name: 'Debugging',
    category: 'Technical',
  },
  {
    id: 'project-expo',
    name: 'Project Expo',
    category: 'Technical',
  },
  {
    id: 'website-creation',
    name: 'Website Creation',
    category: 'Technical',
  },
  {
    id: 'memes-creation',
    name: 'Memes Creation',
    category: 'Non-Technical',
  },
  {
    id: 'quiz',
    name: 'Quiz',
    category: 'Non-Technical',
  },
  {
    id: 'imposter',
    name: 'Imposter',
    category: 'Non-Technical',
  },
  {
    id: 'finding-bgm',
    name: 'Finding BGM',
    category: 'Non-Technical',
  },
];

const NORMAL_EVENTS = EVENTS.filter(
  (event) => !event.isPpt
);

const emptyMember = {
  name: '',
  email: '',
  phone: '',
  department: '',
  year: '',
  events: [],
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const preselectedEvent = location.state?.event;

  const [registrationType, setRegistrationType] =
    useState(
      preselectedEvent?.isPpt
        ? 'ppt'
        : 'individual'
    );

  const [selectedEvents, setSelectedEvents] =
    useState(
      preselectedEvent?.id
        ? [preselectedEvent.id]
        : []
    );

  const [individual, setIndividual] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: '',
    year: '',
  });

  const [team, setTeam] = useState({
    teamName: '',
    presentationTitle: '',
    leaderIndex: 0,
    members: [
      { ...emptyMember },
      { ...emptyMember },
      { ...emptyMember },
    ],
  });

  const [referralCode, setReferralCode] =
    useState('');

  const [referralApplied, setReferralApplied] =
    useState(false);

  const [referralChecking, setReferralChecking] =
    useState(false);

  const [utr, setUtr] = useState('');

  const [paymentConfirmed, setPaymentConfirmed] =
    useState(false);

  const [pptFile, setPptFile] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const isPpt =
    registrationType === 'ppt';

  /* ---------------------------------------------
     EVENT SELECTION
  --------------------------------------------- */

  const toggleIndividualEvent = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const toggleMemberEvent = (
    memberIndex,
    eventId
  ) => {
    setTeam((prev) => ({
      ...prev,

      members: prev.members.map(
        (member, index) => {
          if (index !== memberIndex) {
            return member;
          }

          const exists =
            member.events.includes(eventId);

          return {
            ...member,
            events: exists
              ? member.events.filter(
                  (id) => id !== eventId
                )
              : [...member.events, eventId],
          };
        }
      ),
    }));
  };

  /* ---------------------------------------------
     REGISTRATION TYPE
  --------------------------------------------- */

  const changeRegistrationType = (type) => {
    setRegistrationType(type);
    setReferralApplied(false);

    if (type === 'individual') {
      setSelectedEvents([]);
    } else {
      setSelectedEvents([
        'paper-preparation',
      ]);

      setTeam((prev) => ({
        ...prev,
        members: prev.members.map(
          (member) => ({
            ...member,
            events: [],
          })
        ),
      }));
    }
  };

  /* ---------------------------------------------
     TEAM
  --------------------------------------------- */

  const updateTeamField = (
    field,
    value
  ) => {
    setTeam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateMember = (
    index,
    field,
    value
  ) => {
    setTeam((prev) => ({
      ...prev,

      members: prev.members.map(
        (member, memberIndex) =>
          memberIndex === index
            ? {
                ...member,
                [field]: value,
              }
            : member
      ),
    }));
  };

  /* ---------------------------------------------
     FILE
  --------------------------------------------- */

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    const extension = file.name
      .split('.')
      .pop()
      ?.toLowerCase();

    const allowedExtensions = [
      'pdf',
      'ppt',
      'pptx',
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(
        extension
      )
    ) {
      toast.error(
        'Only PPT, PPTX or PDF files are allowed.'
      );

      event.target.value = '';
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      toast.error(
        'File size must be below 10 MB.'
      );

      event.target.value = '';
      return;
    }

    setPptFile(file);
  };

  /* ---------------------------------------------
     REFERRAL
  --------------------------------------------- */

  const applyReferral = async () => {
    const code =
      referralCode.trim();

    if (!code) {
      toast.error(
        'Enter a referral code.'
      );
      return;
    }

    setReferralChecking(true);

    try {
      const response =
        await api.post(
          '/registrations/validate-referral',
          {
            referralCode: code,
          }
        );

      if (response.data?.valid) {
        setReferralApplied(true);

        toast.success(
          'Referral code applied. ₹10 discount added.'
        );
      } else {
        setReferralApplied(false);

        toast.error(
          response.data?.message ||
            'Invalid or already used referral code.'
        );
      }
    } catch (error) {
      setReferralApplied(false);

      toast.error(
        error.response?.data?.message ||
          'Unable to validate referral code.'
      );
    } finally {
      setReferralChecking(false);
    }
  };

  const removeReferral = () => {
    setReferralCode('');
    setReferralApplied(false);
  };

  /* ---------------------------------------------
     AMOUNT
  --------------------------------------------- */

  const baseAmount = isPpt
    ? 600
    : 200;

  const discount =
    referralApplied ? 10 : 0;

  const finalAmount =
    Math.max(
      baseAmount - discount,
      0
    );

  /* ---------------------------------------------
     DISPLAY
  --------------------------------------------- */

  const individualEventNames =
    useMemo(
      () =>
        selectedEvents
          .map(
            (id) =>
              EVENTS.find(
                (event) =>
                  event.id === id
              )?.name
          )
          .filter(Boolean),
      [selectedEvents]
    );

  const teamMemberEventNames = (
    events
  ) =>
    events
      .map(
        (id) =>
          EVENTS.find(
            (event) =>
              event.id === id
          )?.name
      )
      .filter(Boolean);

  /* ---------------------------------------------
     VALIDATION
  --------------------------------------------- */

  const validateIndividual = () => {
    if (!individual.name.trim()) {
      toast.error(
        'Enter your name.'
      );
      return false;
    }

    if (!individual.email.trim()) {
      toast.error(
        'Enter your email.'
      );
      return false;
    }

    if (!individual.phone.trim()) {
      toast.error(
        'Enter your phone number.'
      );
      return false;
    }

    if (
      !individual.department.trim()
    ) {
      toast.error(
        'Enter your department.'
      );
      return false;
    }

    if (!individual.year) {
      toast.error(
        'Select your year.'
      );
      return false;
    }

    if (
      selectedEvents.length === 0
    ) {
      toast.error(
        'Select at least one event.'
      );
      return false;
    }

    return true;
  };

  const validatePpt = () => {
    if (!team.teamName.trim()) {
      toast.error(
        'Enter team name.'
      );
      return false;
    }

    if (
      !team.presentationTitle.trim()
    ) {
      toast.error(
        'Enter presentation title.'
      );
      return false;
    }

    for (let i = 0; i < 3; i++) {
      const member =
        team.members[i];

      if (!member.name.trim()) {
        toast.error(
          `Enter Member ${i + 1} name.`
        );
        return false;
      }

      if (!member.email.trim()) {
        toast.error(
          `Enter Member ${i + 1} email.`
        );
        return false;
      }

      if (!member.phone.trim()) {
        toast.error(
          `Enter Member ${i + 1} phone.`
        );
        return false;
      }

      if (
        !member.department.trim()
      ) {
        toast.error(
          `Enter Member ${i + 1} department.`
        );
        return false;
      }

      if (!member.year) {
        toast.error(
          `Select Member ${i + 1} year.`
        );
        return false;
      }
    }

    if (!pptFile) {
      toast.error(
        'Upload your PPT/PPTX/PDF file.'
      );
      return false;
    }

    return true;
  };

  /* ---------------------------------------------
     SUBMIT
  --------------------------------------------- */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (isPpt) {
      if (!validatePpt()) return;
    } else {
      if (!validateIndividual()) {
        return;
      }
    }

    if (!paymentConfirmed) {
      toast.error(
        'Please complete payment and confirm it.'
      );
      return;
    }

    if (!utr.trim()) {
      toast.error(
        'Enter UTR / Transaction ID.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData =
        new FormData();

      formData.append(
        'registrationType',
        registrationType
      );

      if (isPpt) {
        formData.append(
          'pptMode',
          'offline'
        );

        formData.append(
          'teamName',
          team.teamName
        );

        formData.append(
          'presentationTitle',
          team.presentationTitle
        );

        formData.append(
          'leaderIndex',
          String(team.leaderIndex)
        );

        formData.append(
          'members',
          JSON.stringify(
            team.members
          )
        );

        formData.append(
          'events',
          JSON.stringify([
            'paper-preparation',
            ...team.members.flatMap(
              (member) =>
                member.events
            ),
          ])
        );

        formData.append(
          'pptFile',
          pptFile
        );
      } else {
        formData.append(
          'name',
          individual.name
        );

        formData.append(
          'email',
          individual.email
        );

        formData.append(
          'phone',
          individual.phone
        );

        formData.append(
          'department',
          individual.department
        );

        formData.append(
          'year',
          individual.year
        );

        formData.append(
          'events',
          JSON.stringify(
            selectedEvents
          )
        );
      }

      formData.append(
        'referralCode',
        referralCode.trim()
      );

      formData.append(
        'utr',
        utr.trim()
      );

      formData.append(
        'paymentConfirmed',
        'true'
      );

      const response =
        await api.post(
          '/registrations',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      toast.success(
        'Registration submitted successfully!'
      );

      navigate(
        '/my-registration',
        {
          state: {
            registration:
              response.data
                ?.registration,
          },
        }
      );
    } catch (error) {
      console.error(
        'REGISTRATION ERROR:',
        error
      );

      const message =
        error.response?.data
          ?.message ||
        error.response?.data
          ?.error ||
        error.message ||
        'Registration failed. Please try again.';

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl pb-12">

        {/* HEADER */}
        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate('/events')
            }
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Events
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <Zap
                size={21}
                className="text-red-500"
              />
            </div>

            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">
                INFOVERSE 2026
              </p>

              <h1 className="text-3xl font-black text-white lg:text-4xl">
                Event Registration
              </h1>
            </div>

          </div>

          <p className="mt-3 text-gray-400">
            Select your events and complete
            your registration.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* LEFT */}
            <div className="space-y-6 xl:col-span-2">

              {/* REGISTRATION TYPE */}
              <section className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6">

                <h2 className="mb-5 text-lg font-bold text-white">
                  Registration Type
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={() =>
                      changeRegistrationType(
                        'individual'
                      )
                    }
                    className={`rounded-xl border p-5 text-left transition ${
                      registrationType ===
                      'individual'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <Users
                        size={22}
                        className="text-red-500"
                      />

                      {registrationType ===
                        'individual' && (
                        <Check
                          size={20}
                          className="text-red-500"
                        />
                      )}

                    </div>

                    <h3 className="font-bold text-white">
                      Individual Registration
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Participate in multiple
                      normal events.
                    </p>

                    <p className="mt-3 font-bold text-red-400">
                      ₹200 Total
                    </p>

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeRegistrationType(
                        'ppt'
                      )
                    }
                    className={`rounded-xl border p-5 text-left transition ${
                      registrationType === 'ppt'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >

                    <div className="mb-3 flex items-center justify-between">

                      <FileText
                        size={22}
                        className="text-red-500"
                      />

                      {registrationType ===
                        'ppt' && (
                        <Check
                          size={20}
                          className="text-red-500"
                        />
                      )}

                    </div>

                    <h3 className="font-bold text-white">
                      PPT Team Registration
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Exactly 3 members.
                    </p>

                    <p className="mt-3 font-bold text-red-400">
                      ₹600 Total
                    </p>

                  </button>

                </div>

              </section>

              {/* INDIVIDUAL */}
              {!isPpt && (
                <>
                  <section className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6">

                    <h2 className="mb-5 text-lg font-bold text-white">
                      Participant Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      <Input
                        label="Full Name"
                        value={
                          individual.name
                        }
                        onChange={(e) =>
                          setIndividual({
                            ...individual,
                            name: e.target.value,
                          })
                        }
                        required
                      />

                      <Input
                        label="Email"
                        type="email"
                        value={
                          individual.email
                        }
                        onChange={(e) =>
                          setIndividual({
                            ...individual,
                            email: e.target.value,
                          })
                        }
                        required
                      />

                      <Input
                        label="Phone Number"
                        value={
                          individual.phone
                        }
                        onChange={(e) =>
                          setIndividual({
                            ...individual,
                            phone: e.target.value,
                          })
                        }
                        required
                      />

                      <Input
                        label="Department"
                        value={
                          individual.department
                        }
                        onChange={(e) =>
                          setIndividual({
                            ...individual,
                            department:
                              e.target.value,
                          })
                        }
                        required
                      />

                      <Select
                        label="Year"
                        value={
                          individual.year
                        }
                        onChange={(e) =>
                          setIndividual({
                            ...individual,
                            year: e.target.value,
                          })
                        }
                        options={[
                          '1st Year',
                          '2nd Year',
                          '3rd Year',
                          'Final Year',
                        ]}
                      />

                    </div>

                  </section>

                  <EventSelection
                    title="Select Events"
                    subtitle="Select multiple events. Registration fee remains ₹200."
                    events={NORMAL_EVENTS}
                    selected={
                      selectedEvents
                    }
                    onToggle={
                      toggleIndividualEvent
                    }
                  />
                </>
              )}

              {/* PPT */}
              {isPpt && (
                <>
                  <section className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6">

                    <div className="mb-5 flex items-center gap-3">

                      <Users
                        size={22}
                        className="text-red-500"
                      />

                      <div>
                        <h2 className="text-lg font-bold text-white">
                          PPT Team Details
                        </h2>

                        <p className="text-sm text-gray-400">
                          Exactly 3 members required
                        </p>
                      </div>

                    </div>

                    <div className="space-y-4">

                      <Input
                        label="Team Name"
                        value={
                          team.teamName
                        }
                        onChange={(e) =>
                          updateTeamField(
                            'teamName',
                            e.target.value
                          )
                        }
                        required
                      />

                      <Input
                        label="Presentation Title"
                        value={
                          team.presentationTitle
                        }
                        onChange={(e) =>
                          updateTeamField(
                            'presentationTitle',
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>

                  </section>

                  {team.members.map(
                    (
                      member,
                      index
                    ) => (
                      <section
                        key={index}
                        className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6"
                      >

                        <div className="mb-5 flex items-center justify-between">

                          <div>
                            <h2 className="text-lg font-bold text-white">
                              Member {index + 1}
                            </h2>

                            <p className="text-sm text-gray-400">
                              Member details
                            </p>
                          </div>

                          {team.leaderIndex ===
                            index && (
                            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400">
                              Team Leader
                            </span>
                          )}

                        </div>

                        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                          <Input
                            label="Name"
                            value={
                              member.name
                            }
                            onChange={(e) =>
                              updateMember(
                                index,
                                'name',
                                e.target.value
                              )
                            }
                            required
                          />

                          <Input
                            label="Email"
                            type="email"
                            value={
                              member.email
                            }
                            onChange={(e) =>
                              updateMember(
                                index,
                                'email',
                                e.target.value
                              )
                            }
                            required
                          />

                          <Input
                            label="Phone"
                            value={
                              member.phone
                            }
                            onChange={(e) =>
                              updateMember(
                                index,
                                'phone',
                                e.target.value
                              )
                            }
                            required
                          />

                          <Input
                            label="Department"
                            value={
                              member.department
                            }
                            onChange={(e) =>
                              updateMember(
                                index,
                                'department',
                                e.target.value
                              )
                            }
                            required
                          />

                          <Select
                            label="Year"
                            value={
                              member.year
                            }
                            onChange={(e) =>
                              updateMember(
                                index,
                                'year',
                                e.target.value
                              )
                            }
                            options={[
                              '1st Year',
                              '2nd Year',
                              '3rd Year',
                              'Final Year',
                            ]}
                          />

                          <div>
                            <label className="mb-2 block text-sm text-gray-400">
                              Team Leader
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                setTeam(
                                  (
                                    prev
                                  ) => ({
                                    ...prev,
                                    leaderIndex:
                                      index,
                                  })
                                )
                              }
                              className={`h-11 w-full rounded-lg border text-sm ${
                                team.leaderIndex ===
                                index
                                  ? 'border-red-500 bg-red-500/10 text-red-400'
                                  : 'border-white/10 bg-white/[0.03] text-gray-400'
                              }`}
                            >
                              {team.leaderIndex ===
                              index
                                ? 'Selected as Leader'
                                : 'Make Team Leader'}
                            </button>

                          </div>

                        </div>

                        <EventSelection
                          title={`Member ${
                            index + 1
                          } Events`}
                          subtitle="Additional events are included in the ₹600 team registration."
                          events={
                            NORMAL_EVENTS
                          }
                          selected={
                            member.events
                          }
                          onToggle={(
                            eventId
                          ) =>
                            toggleMemberEvent(
                              index,
                              eventId
                            )
                          }
                        />

                      </section>
                    )
                  )}

                  {/* FILE */}
                  <section className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6">

                    <h2 className="text-lg font-bold text-white">
                      Presentation File
                    </h2>

                    <p className="mb-4 mt-1 text-sm text-gray-400">
                      Upload PPT, PPTX or PDF.
                      Maximum 10 MB.
                    </p>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-8 transition hover:border-red-500/50">

                      <Upload
                        size={30}
                        className="mb-3 text-red-500"
                      />

                      {pptFile ? (
                        <>
                          <p className="font-medium text-white">
                            {pptFile.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {(
                              pptFile.size /
                              1024 /
                              1024
                            ).toFixed(2)}{' '}
                            MB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-white">
                            Click to upload
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            PPT / PPTX / PDF
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        accept=".ppt,.pptx,.pdf"
                        onChange={
                          handleFileChange
                        }
                        className="hidden"
                      />

                    </label>

                    {pptFile && (
                      <button
                        type="button"
                        onClick={() =>
                          setPptFile(null)
                        }
                        className="mt-3 text-sm text-red-400"
                      >
                        Remove file
                      </button>
                    )}

                  </section>
                </>
              )}

              {/* PAYMENT */}
              <section className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6">

                <div className="mb-6 flex items-center gap-3">

                  <CreditCard
                    size={22}
                    className="text-red-500"
                  />

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Scan & Pay
                    </h2>

                    <p className="text-sm text-gray-400">
                      Pay the exact amount shown below.
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* QR */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">

                    <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-xl bg-white p-2">

                      <img
                        src="/infoverse-qr.png"
                        alt="INFOVERSE UPI QR"
                        className="h-full w-full object-contain"
                      />

                    </div>

                    <p className="mt-4 font-bold text-white">
                      INFOVERSE UPI
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Scan using any UPI app
                    </p>

                  </div>

                  {/* PAYMENT DETAILS */}
                  <div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">

                      <div className="flex justify-between text-sm text-gray-400">
                        <span>
                          Registration Fee
                        </span>

                        <span>
                          ₹{baseAmount}
                        </span>
                      </div>

                      {referralApplied && (
                        <div className="mt-3 flex justify-between text-sm text-green-400">
                          <span>
                            Referral Discount
                          </span>

                          <span>
                            -₹10
                          </span>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">

                        <span className="font-bold text-white">
                          Total
                        </span>

                        <span className="flex items-center text-3xl font-black text-red-500">
                          <IndianRupee
                            size={22}
                          />
                          {finalAmount}
                        </span>

                      </div>

                    </div>

                    {/* REFERRAL */}
                    <div className="mt-5">

                      <label className="mb-2 block text-sm text-gray-400">
                        Referral Code
                      </label>

                      {!referralApplied ? (
                        <div className="flex gap-2">

                          <input
                            value={
                              referralCode
                            }
                            onChange={(e) =>
                              setReferralCode(
                                e.target.value.toUpperCase()
                              )
                            }
                            placeholder="Enter referral code"
                            className="h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-white outline-none placeholder:text-gray-600 focus:border-red-500"
                          />

                          <button
                            type="button"
                            onClick={
                              applyReferral
                            }
                            disabled={
                              referralChecking
                            }
                            className="rounded-lg bg-red-600 px-5 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                          >
                            {referralChecking
                              ? 'Checking...'
                              : 'Apply'}
                          </button>

                        </div>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/10 p-3">

                          <div className="flex items-center gap-2 text-sm text-green-400">
                            <Check
                              size={17}
                            />

                            {referralCode}{' '}
                            applied — ₹10
                            discount
                          </div>

                          <button
                            type="button"
                            onClick={
                              removeReferral
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={17} />
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                </div>

                {/* UTR */}
                <div className="mt-6">

                  <Input
                    label="UTR / Transaction ID"
                    value={utr}
                    onChange={(e) =>
                      setUtr(
                        e.target.value
                      )
                    }
                    placeholder="Enter payment transaction ID"
                    required
                  />

                </div>

                {/* CONFIRM PAYMENT */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentConfirmed(
                      !paymentConfirmed
                    )
                  }
                  className={`mt-5 flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                    paymentConfirmed
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >

                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      paymentConfirmed
                        ? 'border-green-500 bg-green-500'
                        : 'border-white/20'
                    }`}
                  >
                    {paymentConfirmed && (
                      <Check
                        size={13}
                        className="text-white"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      I have completed the payment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      I confirm that I paid the exact
                      amount and entered the correct UTR.
                    </p>
                  </div>

                </button>

                <div className="mt-4 flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-yellow-400"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Payment status will be{' '}
                    <span className="text-yellow-400">
                      Pending
                    </span>{' '}
                    until the admin verifies your transaction.
                  </p>

                </div>

              </section>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? 'Submitting Registration...'
                  : `Complete Registration — ₹${finalAmount}`}
              </button>

            </div>

            {/* RIGHT SUMMARY */}
            <div className="xl:col-span-1">

              <div className="sticky top-6 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl">

                <h2 className="mb-5 text-lg font-bold text-white">
                  Registration Summary
                </h2>

                <div className="space-y-4">

                  <SummaryRow
                    label="Type"
                    value={
                      isPpt
                        ? 'PPT Team'
                        : 'Individual'
                    }
                  />

                  <SummaryRow
                    label="Date"
                    value="09/10/2026"
                  />

                  <SummaryRow
                    label="Venue"
                    value="DMI Engineering College"
                  />

                  <div className="border-t border-white/10 pt-4">

                    <p className="mb-3 text-sm text-gray-400">
                      Selected Events
                    </p>

                    {!isPpt && (
                      <div className="space-y-2">

                        {individualEventNames.length >
                        0 ? (
                          individualEventNames.map(
                            (name) => (
                              <div
                                key={name}
                                className="flex gap-2 text-sm text-gray-200"
                              >
                                <Check
                                  size={16}
                                  className="mt-0.5 text-red-500"
                                />

                                {name}
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-600">
                            No events selected
                          </p>
                        )}

                      </div>
                    )}

                    {isPpt && (
                      <div className="space-y-4">

                        {[0, 1, 2].map(
                          (index) => (
                            <SummaryMember
                              key={index}
                              name={`Member ${
                                index + 1
                              }`}
                              events={
                                team.members[
                                  index
                                ].events
                              }
                              getNames={
                                teamMemberEventNames
                              }
                            />
                          )
                        )}

                      </div>
                    )}

                  </div>

                  <div className="border-t border-white/10 pt-4">

                    <div className="flex items-center justify-between">

                      <span className="text-gray-400">
                        Total
                      </span>

                      <span className="text-2xl font-black text-red-500">
                        ₹{finalAmount}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </form>

      </div>
    </Layout>
  );
};

/* ---------------------------------------------
   INPUT
--------------------------------------------- */

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
}) => (
  <div>

    <label className="mb-2 block text-sm text-gray-400">
      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>

    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-gray-600 focus:border-red-500"
    />

  </div>
);

/* ---------------------------------------------
   SELECT
--------------------------------------------- */

const Select = ({
  label,
  value,
  onChange,
  options = [],
}) => (
  <div>

    <label className="mb-2 block text-sm text-gray-400">
      {label}

      <span className="ml-1 text-red-500">
        *
      </span>
    </label>

    <div className="relative">

      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#111] px-4 pr-10 text-white outline-none focus:border-red-500"
      >

        <option value="">
          Select {label}
        </option>

        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}

      </select>

      <ChevronDown
        size={17}
        className="pointer-events-none absolute right-3 top-3.5 text-gray-500"
      />

    </div>

  </div>
);

/* ---------------------------------------------
   EVENT SELECTION
--------------------------------------------- */

const EventSelection = ({
  title,
  subtitle,
  events,
  selected,
  onToggle,
}) => (
  <section className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl lg:p-6">

    <div className="mb-5">

      <h2 className="text-lg font-bold text-white">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        {subtitle}
      </p>

    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

      {events.map(
        (event) => {
          const active =
            selected.includes(
              event.id
            );

          return (
            <button
              key={event.id}
              type="button"
              onClick={() =>
                onToggle(
                  event.id
                )
              }
              className={`rounded-xl border p-4 text-left transition ${
                active
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-white">
                    {event.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {event.category}
                  </p>

                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    active
                      ? 'border-red-500 bg-red-500'
                      : 'border-white/20'
                  }`}
                >
                  {active && (
                    <Check
                      size={14}
                      className="text-white"
                    />
                  )}
                </div>

              </div>

            </button>
          );
        }
      )}

    </div>

  </section>
);

/* ---------------------------------------------
   SUMMARY
--------------------------------------------- */

const SummaryRow = ({
  label,
  value,
}) => (
  <div className="flex justify-between gap-4 text-sm">

    <span className="text-gray-500">
      {label}
    </span>

    <span className="text-right text-gray-200">
      {value}
    </span>

  </div>
);

/* ---------------------------------------------
   SUMMARY MEMBER
--------------------------------------------- */

const SummaryMember = ({
  name,
  events,
  getNames,
}) => {
  const names =
    getNames(events);

  return (
    <div>

      <p className="mb-2 text-sm font-semibold text-gray-300">
        {name}
      </p>

      {names.length > 0 ? (
        <div className="space-y-1">

          {names.map(
            (eventName) => (
              <div
                key={eventName}
                className="flex gap-2 text-xs text-gray-400"
              >
                <Check
                  size={13}
                  className="mt-0.5 text-red-500"
                />

                {eventName}
              </div>
            )
          )}

        </div>
      ) : (
        <p className="text-xs text-gray-600">
          No additional events
        </p>
      )}

    </div>
  );
};

export default RegistrationPage;