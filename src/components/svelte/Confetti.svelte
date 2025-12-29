<script lang="ts">
    import confetti from "canvas-confetti";
    import { onMount, onDestroy } from "svelte";

    let hasPlayed = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    function run() {
        if (hasPlayed) return;

        // Check declined status
        if (
            typeof sessionStorage !== "undefined" &&
            sessionStorage.getItem("rsvp_declined") === "true"
        ) {
            return;
        }

        // Reduced motion check
        if (
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        hasPlayed = true;
        const duration = 4000;
        const end = Date.now() + duration;

        function burst() {
            const now = Date.now();
            if (now > end) {
                if (intervalId) clearInterval(intervalId);
                return;
            }

            confetti({
                particleCount: 10,
                spread: 70,
                startVelocity: 12,
                ticks: 80,
                gravity: 0.6,
                scalar: 1.1,
                origin: {
                    x: 0.1 + Math.random() * 0.8,
                    y: 0.1 + Math.random() * 0.3,
                },
                zIndex: 0,
                disableForReducedMotion: true,
            });
        }

        burst();
        intervalId = setInterval(burst, 280);
    }

    onMount(() => {
        // Small delay to let page render
        requestAnimationFrame(() => {
            setTimeout(run, 100);
        });
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
        confetti.reset();
    });
</script>
