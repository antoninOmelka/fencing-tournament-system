export async function getResults() {
    try {
        const response = await fetch("api/results");
        const data = await response.json();
        return data.participants;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteResults() {
    try {
        const response = await fetch("/api/results", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete results");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
}