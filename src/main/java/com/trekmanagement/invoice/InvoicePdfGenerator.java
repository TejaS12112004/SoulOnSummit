package com.trekmanagement.invoice;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.trekmanagement.booking.Booking;
import com.trekmanagement.booking.BookingParticipant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Component
public class InvoicePdfGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    public byte[] generate(Invoice invoice, Booking booking) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);

            // Title
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            // Invoice details
            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber(), normalFont));
            document.add(new Paragraph("Date: " + invoice.getIssueDate().format(DATE_FORMATTER), normalFont));
            document.add(new Paragraph("Booking Reference: " + booking.getBookingReference(), normalFont));
            
            String customerName = booking.getUser().getFirstName() + " " + (booking.getUser().getLastName() != null ? booking.getUser().getLastName() : "");
            document.add(new Paragraph("Customer Name: " + customerName.trim(), normalFont));
            document.add(new Paragraph("Email: " + booking.getUser().getEmail(), normalFont));
            
            document.add(new Paragraph(" ")); // Spacer
            
            // Trek details
            document.add(new Paragraph("Trek Details", boldFont));
            document.add(new Paragraph("Trek: " + booking.getDeparture().getTrek().getTitle(), normalFont));
            document.add(new Paragraph("Departure Date: " + booking.getDeparture().getStartDate().format(DATE_FORMATTER), normalFont));
            document.add(new Paragraph("Total Participants: " + booking.getTotalParticipants(), normalFont));
            
            document.add(new Paragraph(" ")); // Spacer

            // Participants Table
            document.add(new Paragraph("Participants", boldFont));
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(20f);

            addTableHeader(table, boldFont, "Name", "Age", "Gender");
            
            List<BookingParticipant> participants = booking.getParticipants();
            for (BookingParticipant p : participants) {
                table.addCell(new Phrase(p.getFullName(), normalFont));
                table.addCell(new Phrase(String.valueOf(p.getAge()), normalFont));
                table.addCell(new Phrase(p.getGender().name(), normalFont));
            }
            document.add(table);

            // Payment Summary
            document.add(new Paragraph("Payment Summary", boldFont));
            document.add(new Paragraph("Subtotal: INR " + booking.getSubtotal(), normalFont));
            
            if (booking.getDiscountAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                document.add(new Paragraph("Discount: INR " + booking.getDiscountAmount(), normalFont));
            }
            
            document.add(new Paragraph("GST: INR " + invoice.getGstAmount(), normalFont));
            document.add(new Paragraph("Total Amount Paid: INR " + invoice.getTotalAmount(), boldFont));

            document.close();
            return out.toByteArray();
        } catch (DocumentException | java.io.IOException ex) {
            log.error("Failed to generate PDF for invoice {}", invoice.getInvoiceNumber(), ex);
            throw new RuntimeException("Error generating PDF invoice", ex);
        }
    }

    private void addTableHeader(PdfPTable table, Font font, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            cell.setBackgroundColor(Color.LIGHT_GRAY);
            table.addCell(cell);
        }
    }
}
