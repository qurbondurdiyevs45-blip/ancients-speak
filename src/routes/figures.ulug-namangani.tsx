import { createFileRoute, redirect } from "@tanstack/react-router";

// Eski havola: Hamza Hakimzoda Niyoziy slug'i "hamza" ga o‘zgartirildi.
export const Route = createFileRoute("/figures/ulug-namangani")({
  beforeLoad: () => {
    throw redirect({
      to: "/figures/$id",
      params: { id: "hamza" },
      statusCode: 301,
    });
  },
});
