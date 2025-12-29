<script lang="ts">
    import confetti from "canvas-confetti";
    import { onMount, onDestroy } from "svelte";

    let intervalId: ReturnType<typeof setInterval>;

    onMount(() => {
        // Don't run if declined or reduced motion
        if (sessionStorage.getItem("rsvp_declined") === "true") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;

        const duration = 3000;
        const end = Date.now() + duration;

        function burst() {
            if (Date.now() > end) {
                clearInterval(intervalId);
                return;
            }

            confetti({
                particleCount: 8,
                spread: 60,
                startVelocity: 15,
                ticks: 60,
                gravity: 0.8,
                scalar: 1,
                origin: {
                    x: 0.2 + Math.random() * 0.6,
                    y: 0.2 + Math.random() * 0.2,
                },
                zIndex: 0,
                disableForReducedMotion: true,
            });
        }

        // Start after a short delay
        setTimeout(() => {
            burst();
            intervalId = setInterval(burst, 250);
        }, 200);
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
        confetti.reset();
    });
</script>
