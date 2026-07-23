import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { Response } from 'express';
import { prisma } from '../app';
import { getDegreeClassification } from './gpa';

/**
 * Generates a professional PDF transcript for a student.
 * The PDF is streamed directly to the HTTP response.
 */
export const generateTranscriptPDF = async (student: any, res: Response) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=transcript.pdf');
  doc.pipe(res);

  // --- University Header ---
  doc.fontSize(22).font('Helvetica-Bold').text('DallaGPA University', { align: 'center' });
  doc.fontSize(16).font('Helvetica').text('Official Academic Transcript', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(10).text('This transcript is issued by the Registrar\'s Office and is certified as authentic.', { align: 'center' });
  doc.moveDown();

  // --- Student Information ---
  const profile = student.user.profile;
  doc.fontSize(12).font('Helvetica-Bold').text('Student Information', { underline: true });
  doc.fontSize(11).font('Helvetica')
    .text(`Name: ${profile?.firstName || ''} ${profile?.lastName || ''}`)
    .text(`Registration Number: ${student.regNo}`)
    .text(`Programme: ${student.programme}`)
    .text(`Faculty: ${student.faculty.name}`)
    .text(`Department: ${student.department.name}`)
    .text(`Year of Study: ${student.currentYear}`)
    .text(`Status: ${student.status}`);
  doc.moveDown();

  // --- Results Table ---
  const tableTop = doc.y;
  doc.fontSize(11).font('Helvetica-Bold');
  const columns = { code: 50, name: 120, credits: 280, grade: 350, gp: 400, qp: 450 };
  doc.text('Code', columns.code, tableTop)
     .text('Course', columns.name, tableTop)
     .text('Credits', columns.credits, tableTop)
     .text('Grade', columns.grade, tableTop)
     .text('GP', columns.gp, tableTop)
     .text('QP', columns.qp, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let y = tableTop + 25;
  doc.font('Helvetica');
  for (const r of student.results) {
    doc.fontSize(10)
       .text(r.course.code, columns.code, y)
       .text(r.course.name.substring(0, 30), columns.name, y)
       .text(r.course.credits.toString(), columns.credits, y)
       .text(r.grade, columns.grade, y)
       .text(r.gradePoint.toFixed(2), columns.gp, y)
       .text(r.qualityPoints.toFixed(2), columns.qp, y);
    y += 18;
  }

  // --- Summary & CGPA ---
  const totalQP = student.results.reduce((sum: number, r: any) => sum + r.qualityPoints, 0);
  const totalCredits = student.results.reduce((sum: number, r: any) => sum + r.course.credits, 0);
  const cgpa = totalCredits ? totalQP / totalCredits : 0;

  const classifications = await prisma.degreeClassification.findMany();
  const classification = getDegreeClassification(cgpa, classifications);

  doc.moveDown();
  doc.fontSize(12).font('Helvetica-Bold').text(`Cumulative GPA (CGPA): ${cgpa.toFixed(4)}`);
  doc.text(`Classification: ${classification}`);
  doc.text(`Total Credits Completed: ${totalCredits}`);
  doc.text(`Total Quality Points: ${totalQP.toFixed(2)}`);

  // --- QR Code (for verification) ---
  const qrData = JSON.stringify({
    regNo: student.regNo,
    cgpa: cgpa.toFixed(4),
    classification,
    issued: new Date().toISOString(),
  });
  const qrImage = await QRCode.toBuffer(qrData);
  doc.image(qrImage, 450, 650, { width: 80 });

  // --- Footer ---
  doc.fontSize(9).font('Helvetica')
     .text('Digital Signature: ********************************', 50, 720)
     .text(`Generated on: ${new Date().toLocaleString()}`, 50, 740)
     .text('This transcript is electronically verifiable. Any alteration invalidates it.', 50, 760);

  doc.end();
};
