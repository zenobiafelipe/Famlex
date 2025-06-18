export function loadGoogleMapsScript() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
