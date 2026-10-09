
import { useEffect, useState } from "react";
import { getCustomerImage } from "../../api/orders";

interface AdminCustomerImageProps {
  imageUrl: string;
}

export default function AdminCustomerImage({
  imageUrl,
}: AdminCustomerImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    setImageSrc(null);
    setError(false);

    getCustomerImage(imageUrl)
      .then((url) => {
        if (active) {
          objectUrl = url;
          setImageSrc(url);
        } else {
          URL.revokeObjectURL(url);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
        }
      });

    return () => {
      active = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl]);

  if (error) {
    return <p>Kunde inte hämta kundbilden.</p>;
  }

  return (
    <div className="admin-customer-image">
      <p><strong>Kundens uppladdade bild:</strong></p>

      {imageSrc ? (
        <a href={imageSrc} target="_blank" rel="noopener noreferrer">
          <img
            src={imageSrc}
            alt="Kundens uppladdade bild"
            style={{
              width: "150px",
              maxWidth: "100%",
              height: "auto",
              borderRadius: "6px",
              marginTop: "8px",
            }}
          />
        </a>
      ) : (
        <p>Laddar bild...</p>
      )}
    </div>
  );
}
