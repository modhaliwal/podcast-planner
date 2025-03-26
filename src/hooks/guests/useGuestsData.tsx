
import { useState, useRef, useEffect } from "react";
import { Guest } from "@/lib/types";
import { useGuestsRefresh } from "./useGuestsRefresh";

export function useGuestsData(userId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const { isLoadingGuests, refreshGuests } = useGuestsRefresh(userId);
  const isInitialMountRef = useRef(true);

  // Load guests on initial mount only
  useEffect(() => {
    if (userId && isInitialMountRef.current) {
      console.log("Initial useGuestsData mount, refreshing guests");
      refreshGuests().then(fetchedGuests => {
        setGuests(fetchedGuests);
      });
      isInitialMountRef.current = false;
    }
  }, [userId, refreshGuests]);

  // Create a function that wraps refreshGuests and updates the guests state
  const refreshAndUpdateGuests = async () => {
    const fetchedGuests = await refreshGuests();
    setGuests(fetchedGuests);
  };

  return {
    guests,
    isLoadingGuests,
    refreshGuests: refreshAndUpdateGuests
  };
}
