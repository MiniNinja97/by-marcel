
import { useEffect, useState } from "react";

interface CartCustomerImagesProps {
  files: File[];
}

export default function CartCustomerImages({
  files,
}: CartCustomerImagesProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return (
    <div className="cart-customer-images">
      {imageUrls.map((url, index) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={url}
            alt={`Uppladdad bild ${index + 1}`}
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
        </a>
      ))}
    </div>
  );
}
