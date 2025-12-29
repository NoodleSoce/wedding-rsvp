<script lang="ts">
    import { onMount } from "svelte";
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;
    export let redirectUrl: string;
    export let apiEndpoint: string;

    const KEY = "rsvp";

    let name = "";
    let attending = "yes";
    let guests = "0";
    let isSubmitting = false;
    let showError = false;
    let showLoading = false;
    let showCheckmark = false;
    let spinnerFadingOut = false;

    let nameEl: HTMLInputElement;
    let guestsEl: HTMLInputElement;
    let submitBtn: HTMLButtonElement;
    let keyboardOpen = false;
    let isBrowser = false;

    // Load saved data
    function loadSavedData() {
        if (!isBrowser) return;
        try {
            const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
            if (saved.name) name = saved.name;
            if (saved.guests) guests = saved.guests;
            if (saved.attending) attending = saved.attending;
        } catch {}
    }

    // Save data with debounce
    let saveTimeout: ReturnType<typeof setTimeout>;
    function saveData() {
        if (!isBrowser) return;
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem(
                KEY,
                JSON.stringify({ name, attending, guests }),
            );
        }, 200);
    }

    // Scroll form into view on mobile keyboard
    function scrollToShowForm() {
        setTimeout(() => {
            submitBtn?.scrollIntoView({ behavior: "auto", block: "end" });
        }, 50);
    }

    function handleNameFocus() {
        keyboardOpen = true;
        scrollToShowForm();
    }

    function handleGuestsFocus() {
        keyboardOpen = true;
        scrollToShowForm();
        setTimeout(() => guestsEl?.select(), 50);
    }

    function handleBlur() {
        setTimeout(() => {
            const active = document.activeElement as HTMLElement;
            const isInForm =
                active?.closest("form") || active?.closest(".radio-label");
            if (!isInForm) {
                keyboardOpen = false;
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 100);
    }

    function handleGuestsInput() {
        let v = guests.replace(/\D/g, "");
        if (v.length > 1) v = v.slice(-1);
        guests = v || "0";
        saveData();
    }

    function handleAttendingChange() {
        saveData();
        if (keyboardOpen) nameEl?.focus();
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        (document.activeElement as HTMLElement)?.blur();
        keyboardOpen = false;

        showLoading = true;
        spinnerFadingOut = false;
        showCheckmark = false;
        showError = false;

        const isAttending = attending === "yes";

        // Store decline status for countdown page
        if (typeof sessionStorage !== "undefined") {
            sessionStorage.setItem(
                "rsvp_declined",
                isAttending ? "false" : "true",
            );
            sessionStorage.setItem("rsvp_submitted", "true");
        }

        try {
            // Try local D1 API first, fallback to Google Sheets
            const localApiUrl = "/api/rsvp";
            const payload = {
                name: name.trim(),
                attending: isAttending ? "Yes" : "No",
                guests: isAttending ? +guests : 0,
            };

            try {
                const response = await fetch(localApiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error("API error");
            } catch {
                // Fallback to Google Sheets API
                await fetch(apiEndpoint, {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(payload),
                });
            }

            if (isBrowser) localStorage.removeItem(KEY);

            spinnerFadingOut = true;

            setTimeout(() => {
                showCheckmark = true;
            }, 300);

            // Navigate after animation
            setTimeout(() => {
                window.location.replace(redirectUrl);
            }, 900);
        } catch {
            isSubmitting = false;
            showLoading = false;
            showError = true;
        }
    }

    onMount(() => {
        isBrowser = true;
        loadSavedData();
        sessionStorage.removeItem("rsvp_submitted");

        // Handle back/forward cache
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                isSubmitting = false;
                showLoading = false;
                showCheckmark = false;
                spinnerFadingOut = false;
                showError = false;
                sessionStorage.removeItem("rsvp_submitted");
            }
        };

        // Handle visual viewport resize (keyboard)
        let lastHeight = window.visualViewport?.height || window.innerHeight;
        const handleResize = () => {
            const currentHeight = window.visualViewport!.height;
            if (currentHeight > lastHeight + 100) {
                const active = document.activeElement as HTMLElement;
                if (active === nameEl || active === guestsEl) {
                    active.blur();
                    keyboardOpen = false;
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            }
            lastHeight = currentHeight;
        };

        window.addEventListener("pageshow", handlePageShow);
        window.visualViewport?.addEventListener("resize", handleResize, {
            passive: true,
        });

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
            window.visualViewport?.removeEventListener("resize", handleResize);
        };
    });

    $: showGuestsSection = attending === "yes";
    $: {
        name;
        saveData();
    }
</script>

<div class="w-full max-w-content">
    <div class="card">
        <form on:submit={handleSubmit}>
            <!-- Name field -->
            <div class="mb-5">
                <label
                    class="block text-base font-medium text-white-90 mb-2 text-start"
                    for="name"
                >
                    {t["rsvp.name"]}
                </label>
                <input
                    type="text"
                    id="name"
                    bind:this={nameEl}
                    bind:value={name}
                    class="input"
                    required
                    placeholder={t["rsvp.namePlaceholder"]}
                    autocomplete="name"
                    autocapitalize="words"
                    enterkeyhint="next"
                    on:focus={handleNameFocus}
                    on:blur={handleBlur}
                />
            </div>

            <!-- Attending toggle -->
            <div class="mb-5">
                <span
                    class="block text-base font-medium text-white-90 mb-2 text-start"
                >
                    {t["rsvp.attending"]}
                </span>
                <div class="flex gap-3" role="radiogroup">
                    <label class="flex-1 cursor-pointer radio-label">
                        <input
                            type="radio"
                            name="attending"
                            value="yes"
                            bind:group={attending}
                            on:change={handleAttendingChange}
                            class="absolute opacity-0 pointer-events-none"
                        />
                        <span
                            class="radio-btn flex justify-center items-center min-h-[52px] p-4 text-base font-semibold text-white rounded-sm-card transition-all duration-150
                            {attending === 'yes'
                                ? 'bg-success border-success'
                                : 'glass-10 border-white-20'} border"
                        >
                            {t["rsvp.accept"]}
                        </span>
                    </label>
                    <label class="flex-1 cursor-pointer radio-label">
                        <input
                            type="radio"
                            name="attending"
                            value="no"
                            bind:group={attending}
                            on:change={handleAttendingChange}
                            class="absolute opacity-0 pointer-events-none"
                        />
                        <span
                            class="radio-btn flex justify-center items-center min-h-[52px] p-4 text-base font-semibold text-white rounded-sm-card transition-all duration-150
                            {attending === 'no'
                                ? 'bg-error border-error'
                                : 'glass-10 border-white-20'} border"
                        >
                            {t["rsvp.decline"]}
                        </span>
                    </label>
                </div>
            </div>

            <!-- Guests section (animated) -->
            <div class="guests-section {showGuestsSection ? 'open' : ''}">
                <div class="mb-5 overflow-hidden">
                    <label
                        class="block text-base font-medium text-white-90 mb-2 text-start"
                        for="guests"
                    >
                        {t["rsvp.guests"]}
                    </label>
                    <input
                        type="number"
                        id="guests"
                        bind:this={guestsEl}
                        bind:value={guests}
                        class="input"
                        min="0"
                        max="9"
                        inputmode="numeric"
                        enterkeyhint="done"
                        on:focus={handleGuestsFocus}
                        on:blur={handleBlur}
                        on:input={handleGuestsInput}
                    />
                </div>
            </div>

            <!-- Submit -->
            <button
                type="submit"
                bind:this={submitBtn}
                class="btn mt-2 text-lg font-medium"
                disabled={isSubmitting}
            >
                {t["rsvp.submit"]}
            </button>

            {#if showError}
                <p class="text-center text-[#f99] text-base mt-4">
                    {t["rsvp.error"]}
                </p>
            {/if}
        </form>
    </div>
</div>

<!-- Loading overlay -->
{#if showLoading}
    <div class="loading-overlay visible">
        <div class="flex justify-center items-center">
            {#if !showCheckmark}
                <div class="spinner {spinnerFadingOut ? 'fade-out' : ''}"></div>
            {:else}
                <svg
                    class="checkmark animate"
                    viewBox="0 0 52 52"
                    aria-hidden="true"
                >
                    <circle
                        class="checkmark-circle"
                        cx="26"
                        cy="26"
                        r="24"
                        fill="none"
                    ></circle>
                    <path
                        class="checkmark-check"
                        fill="none"
                        d="M14 27l8 8 16-16"
                    ></path>
                </svg>
            {/if}
        </div>
    </div>
{/if}

<style>
    .guests-section {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.2s ease;
    }

    .guests-section.open {
        grid-template-rows: 1fr;
    }

    .guests-section > * {
        overflow: hidden;
    }

    .loading-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(75, 1, 1, 0.96);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 0.2s ease,
            visibility 0.2s ease;
    }

    .loading-overlay.visible {
        opacity: 1;
        visibility: visible;
    }

    .spinner {
        width: 52px;
        height: 52px;
        border: 3px solid rgba(255, 255, 255, 0.2);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        transition: opacity 0.3s ease;
        flex-shrink: 0;
    }

    .spinner.fade-out {
        opacity: 0;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .checkmark {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
    }

    .checkmark-circle {
        stroke: #4ade80;
        stroke-width: 2;
        stroke-dasharray: 151;
        stroke-dashoffset: 151;
    }

    .checkmark-check {
        stroke: #4ade80;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 36;
        stroke-dashoffset: 36;
    }

    .checkmark.animate .checkmark-circle {
        animation: checkCircle 0.5s ease forwards;
    }

    .checkmark.animate .checkmark-check {
        animation: checkMark 0.3s ease forwards;
        animation-delay: 0.2s;
    }

    @keyframes checkCircle {
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes checkMark {
        to {
            stroke-dashoffset: 0;
        }
    }

    .bg-success {
        background-color: #2e7d32;
    }
    .border-success {
        border-color: #2e7d32;
    }
    .bg-error {
        background-color: #c62828;
    }
    .border-error {
        border-color: #c62828;
    }
</style>
