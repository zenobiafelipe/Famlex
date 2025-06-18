import React, { useEffect, useRef } from "react";
import { loadGoogleMapsScript } from "../utils/loadGoogleMapsScript";  // ajusta la ruta si es necesario

export default function AutocompleteInput({ value, onChange, placeholder }) {
  const inputRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    loadGoogleMapsScript();

    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "mx" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          } else {
            onChange(inputRef.current.value);
          }
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <input
        ref={inputRef}
        type="text"
        className="form-control border-0 shadow-sm rounded-pill px-3"
        placeholder={placeholder || "Ingresa una dirección"}
        defaultValue={value}
        style={{
          backgroundColor: "#fff",
          fontSize: "1rem",
          width: "100%"
        }}
      />
    </div>
  );
}
