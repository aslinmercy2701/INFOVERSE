const PDFDocument = require('pdfkit');

const generateRegistrationPdf = (registration, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 45,
  });

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="INFOVERSE-${registration.registrationId}.pdf"`
  );

  doc.pipe(res);

  // =====================================================
  // HEADER
  // =====================================================

  doc
    .fontSize(24)
    .fillColor('#ff0022')
    .font('Helvetica-Bold')
    .text('INFOVERSE 2026', {
      align: 'center',
    });

  doc
    .moveDown(0.4)
    .fontSize(12)
    .fillColor('#222')
    .font('Helvetica-Bold')
    .text('DMI Engineering College, Aralvaimozhi', {
      align: 'center',
    });

  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Department of Information Technology', {
      align: 'center',
    });

  doc.moveDown();

  doc
    .moveTo(45, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#ff0022')
    .stroke();

  doc.moveDown();

  // =====================================================
  // TITLE
  // =====================================================

  doc
    .fontSize(18)
    .fillColor('#111')
    .font('Helvetica-Bold')
    .text('OFFICIAL REGISTRATION FORM', {
      align: 'center',
    });

  doc.moveDown(1);

  // =====================================================
  // REGISTRATION DETAILS
  // =====================================================

  addSectionTitle(doc, 'Registration Details');

  addRow(
    doc,
    'Registration ID',
    registration.registrationId || '-'
  );

  addRow(
    doc,
    'Registration Date',
    registration.createdAt
      ? new Date(
          registration.createdAt
        ).toLocaleDateString('en-IN')
      : '-'
  );

  addRow(
    doc,
    'Payment Status',
    registration.paymentStatus
      ? registration.paymentStatus.toUpperCase()
      : '-'
  );

  addRow(
    doc,
    'Transaction / UTR',
    registration.utr || '-'
  );

  // =====================================================
  // PARTICIPANT
  // =====================================================

  addSectionTitle(doc, 'Participant Details');

  addRow(
    doc,
    'Name',
    registration.participantName ||
      registration.name ||
      '-'
  );

  addRow(
    doc,
    'Email',
    registration.email || '-'
  );

  addRow(
    doc,
    'Phone',
    registration.phone || '-'
  );

  addRow(
    doc,
    'Department',
    registration.department || '-'
  );

  addRow(
    doc,
    'Year',
    registration.year || '-'
  );

  addRow(
    doc,
    'College',
    registration.college ||
      'DMI Engineering College'
  );

  // =====================================================
  // TEAM DETAILS
  // =====================================================

  if (
    registration.teamName ||
    registration.teamMembers?.length
  ) {
    addSectionTitle(
      doc,
      'Team Details'
    );

    addRow(
      doc,
      'Team Name',
      registration.teamName || '-'
    );

    const members =
      registration.teamMembers ||
      registration.members ||
      [];

    if (Array.isArray(members)) {
      members.forEach(
        (member, index) => {
          const memberName =
            typeof member === 'string'
              ? member
              : member.name || '-';

          addRow(
            doc,
            `Member ${index + 1}`,
            memberName
          );
        }
      );
    }
  }

  // =====================================================
  // PRESENTATION
  // =====================================================

  if (
    registration.presentationTitle ||
    registration.pptMode
  ) {
    addSectionTitle(
      doc,
      'Presentation Details'
    );

    addRow(
      doc,
      'Presentation Title',
      registration.presentationTitle ||
        '-'
    );

    addRow(
      doc,
      'Mode',
      registration.pptMode
        ? registration.pptMode.toUpperCase()
        : '-'
    );
  }

  // =====================================================
  // EVENTS
  // =====================================================

  addSectionTitle(
    doc,
    'Selected Events'
  );

  const events =
    registration.events ||
    registration.selectedEvents ||
    [];

  if (Array.isArray(events) && events.length) {
    events.forEach((event, index) => {
      const eventName =
        typeof event === 'string'
          ? event
          : event.name || '-';

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#222')
        .text(
          `${index + 1}. ${eventName}`,
          {
            indent: 10,
          }
        );
    });
  } else {
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#555')
      .text('No event information available.');
  }

  // =====================================================
  // PAYMENT
  // =====================================================

  addSectionTitle(
    doc,
    'Payment Details'
  );

  addRow(
    doc,
    'Base Amount',
    `Rs. ${registration.baseAmount ?? '-'}`
  );

  addRow(
    doc,
    'Referral Discount',
    `Rs. ${registration.referralDiscount ?? 0}`
  );

  addRow(
    doc,
    'Final Amount',
    `Rs. ${registration.finalAmount ?? '-'}`
  );

  if (registration.referralCodeUsed) {
    addRow(
      doc,
      'Referral Code',
      registration.referralCodeUsed
    );
  }

  // =====================================================
  // VERIFIED MESSAGE
  // =====================================================

  doc.moveDown(1.5);

  doc
    .roundedRect(
      45,
      doc.y,
      505,
      55,
      6
    )
    .fillColor('#ecfdf5')
    .fill();

  doc
    .fillColor('#166534')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(
      'PAYMENT VERIFIED',
      45,
      doc.y + 15,
      {
        width: 505,
        align: 'center',
      }
    );

  doc
    .font('Helvetica')
    .fontSize(9)
    .text(
      'This registration has been verified by the INFOVERSE administration.',
      45,
      doc.y + 4,
      {
        width: 505,
        align: 'center',
      }
    );

  // =====================================================
  // FOOTER
  // =====================================================

  doc
    .fontSize(8)
    .fillColor('#777')
    .text(
      'INFOVERSE 2026 | DMI Engineering College',
      45,
      770,
      {
        width: 505,
        align: 'center',
      }
    );

  doc.end();
};

// =====================================================
// HELPERS
// =====================================================

const addSectionTitle = (
  doc,
  title
) => {
  doc.moveDown(0.8);

  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#ff0022')
    .text(title);

  doc.moveDown(0.3);
};

const addRow = (
  doc,
  label,
  value
) => {
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#222')
    .text(`${label}: `, {
      continued: true,
    });

  doc
    .font('Helvetica')
    .fillColor('#444')
    .text(String(value ?? '-'));

  doc.moveDown(0.25);
};

module.exports = {
  generateRegistrationPdf,
};