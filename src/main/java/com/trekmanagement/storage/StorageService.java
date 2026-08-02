package com.trekmanagement.storage;

import com.trekmanagement.storage.dto.DeleteFileResponse;
import com.trekmanagement.storage.dto.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface StorageService {

    UploadResponse uploadTrekCover(UUID trekId, MultipartFile file);

    UploadResponse uploadTrekGalleryImage(UUID trekId, MultipartFile file);

    UploadResponse uploadTrekItinerary(UUID trekId, MultipartFile file);

    UploadResponse uploadInvoicePdf(String bookingReference, byte[] pdfBytes);

    UploadResponse uploadUserAvatar(UUID userId, MultipartFile file);

    UploadResponse uploadBlogImage(MultipartFile file);

    UploadResponse uploadSiteLogo(MultipartFile file);
    UploadResponse uploadSiteFavicon(MultipartFile file);

    DeleteFileResponse deleteFile(String bucket, String path);
}
