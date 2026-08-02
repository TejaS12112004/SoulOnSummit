package com.trekmanagement.notification;

import com.trekmanagement.booking.Booking;
import com.trekmanagement.config.MailConfig;
import com.trekmanagement.invoice.Invoice;
import com.trekmanagement.invoice.InvoiceRepository;
import com.trekmanagement.settings.SiteSettingsService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationServiceImpl implements EmailNotificationService {

    private final JavaMailSender mailSender;
    private final MailConfig mailConfig;
    private final InvoiceRepository invoiceRepository;
    private final SiteSettingsService siteSettingsService;

    @Async("notificationExecutor")
    @Override
    public void sendConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailConfig.getFromAddress(), mailConfig.getFromName());
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Confirmed: " + booking.getDeparture().getTrek().getTitle());

            String customerName = booking.getUser().getFirstName();
            String companyName = siteSettingsService.getPublicSettings().getCompanyName();
            
            // Look up invoice to include link
            Optional<Invoice> invoiceOpt = invoiceRepository.findByBookingId(booking.getId());
            String invoiceSection = invoiceOpt.map(i -> 
                "<p>You can download your invoice here: <a href='" + i.getInvoiceUrl() + "'>Download Invoice</a></p>"
            ).orElse("");

            String html = """
                <html>
                <body>
                    <h2>Your Trek is Confirmed!</h2>
                    <p>Hi %s,</p>
                    <p>Your booking for <strong>%s</strong> (Departure: %s) is confirmed.</p>
                    <p>Booking Reference: <strong>%s</strong></p>
                    <p>Total Participants: %d</p>
                    %s
                    <br/>
                    <p>Best regards,<br/>%s</p>
                </body>
                </html>
                """.formatted(
                    customerName, 
                    booking.getDeparture().getTrek().getTitle(),
                    booking.getDeparture().getStartDate().toString(),
                    booking.getBookingReference(),
                    booking.getTotalParticipants(),
                    invoiceSection,
                    companyName
                );

            helper.setText(html, true);
            mailSender.send(message);
            
            log.info("Sent confirmation email for booking: {}", booking.getBookingReference());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send confirmation email for booking: {}", booking.getBookingReference(), e);
        }
    }

    @Async("notificationExecutor")
    @Override
    public void sendCancellation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailConfig.getFromAddress(), mailConfig.getFromName());
            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("Booking Cancelled: " + booking.getDeparture().getTrek().getTitle());

            String customerName = booking.getUser().getFirstName();
            
            String html = """
                <html>
                <body>
                    <h2>Booking Cancelled</h2>
                    <p>Hi %s,</p>
                    <p>Your booking for <strong>%s</strong> (Ref: %s) has been cancelled.</p>
                    <p>If this was a mistake, or if you have questions regarding refunds, please contact support.</p>
                    <br/>
                    <p>Best regards,<br/>The Trek Management Team</p>
                </body>
                </html>
                """.formatted(
                    customerName, 
                    booking.getDeparture().getTrek().getTitle(),
                    booking.getBookingReference()
                );

            helper.setText(html, true);
            mailSender.send(message);
            
            log.info("Sent cancellation email for booking: {}", booking.getBookingReference());

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send cancellation email for booking: {}", booking.getBookingReference(), e);
        }
    }
}
