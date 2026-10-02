// BlueVe Multi-step Form Script
// Google Sheets Integration: Connected Web App URL
const GOOGLE_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-AVW_mE-b-5Qqyc6rpE2TRGsHBYRvXTyqOWm-Mla4xHT_TVnAGbD-Nzr2qf5Zzq0v/exec';

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    const stepSuccess = document.getElementById('step-success');

    const nameInput = document.getElementById('name');
    const companyInput = document.getElementById('company');
    const emailInput = document.getElementById('email');
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]');

    const progressFill1 = document.getElementById('progress-fill-1');
    const progressLabel1 = document.getElementById('progress-label-1');

    const progressFill2 = document.getElementById('progress-fill-2');
    const progressLabel2 = document.getElementById('progress-label-2');

    const progressFill3 = document.getElementById('progress-fill-3');
    const progressLabel3 = document.getElementById('progress-label-3');

    const progressFill4 = document.getElementById('progress-fill-4');
    const progressLabel4 = document.getElementById('progress-label-4');

    const btnNextStep1 = document.getElementById('btn-next-step1');
    const btnBackStep2 = document.getElementById('btn-back-step2');
    const btnNextStep2 = document.getElementById('btn-next-step2');
    const btnBackStep3 = document.getElementById('btn-back-step3');
    const btnNextStep3 = document.getElementById('btn-next-step3');
    const btnBackStep4 = document.getElementById('btn-back-step4');
    const btnSubmitForm = document.getElementById('btn-submit-form');
    const btnRestartForm = document.getElementById('btn-restart-form');
    const successClientName = document.getElementById('success-client-name');
    const formStepperHeader = document.getElementById('form-stepper-header');

    // Stepper indicators
    const stepIndicator1 = document.getElementById('step-indicator-1');
    const stepIndicator2 = document.getElementById('step-indicator-2');
    const stepIndicator3 = document.getElementById('step-indicator-3');
    const stepIndicator4 = document.getElementById('step-indicator-4');

    const stepIcon1 = document.getElementById('step-icon-1');
    const stepIcon2 = document.getElementById('step-icon-2');
    const stepIcon3 = document.getElementById('step-icon-3');
    const stepIcon4 = document.getElementById('step-icon-4');

    const stepStatus1 = document.getElementById('step-status-1');
    const stepStatus2 = document.getElementById('step-status-2');
    const stepStatus3 = document.getElementById('step-status-3');
    const stepStatus4 = document.getElementById('step-status-4');

    // Step 3 inputs & errors
    const likeMostInput = document.getElementById('like-most');
    const likeMostError = document.getElementById('like-most-error');

    // Step 4 inputs & error
    const recommendRadios = document.querySelectorAll('input[name="recommend"]');
    const recommendError = document.getElementById('recommend-error');
    const testimonialInput = document.getElementById('testimonial');

    // Error message elements
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const servicesError = document.getElementById('services-error');

    // Real-time progress calculation for Step 1
    // Starts at 0%, increases as entries are filled, and caps at 25% when all 4 are filled
    function updateStep1Progress() {
        let filledCount = 0;
        const totalItems = 4; // Name, Company, Email, Services

        if (nameInput && nameInput.value.trim().length > 0) filledCount++;
        if (companyInput && companyInput.value.trim().length > 0) filledCount++;
        if (emailInput && emailInput.value.trim().length > 0) filledCount++;

        const isAnyServiceChecked = Array.from(serviceCheckboxes).some(cb => cb.checked);
        if (isAnyServiceChecked) filledCount++;

        // Calculate progress from 0% to 25%
        const percentage = Math.round((filledCount / totalItems) * 25);

        if (progressFill1) {
            progressFill1.style.width = percentage + '%';
        }
        if (progressLabel1) {
            progressLabel1.textContent = `Step 1 of 4 (${percentage}%)`;
        }
    }

    // Input listeners for Step 1 real-time progress & error removal
    [nameInput, companyInput, emailInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function () {
                this.classList.remove('input-error');
                if (this.id === 'name' && nameError) nameError.style.display = 'none';
                if (this.id === 'email' && emailError) emailError.style.display = 'none';
                updateStep1Progress();
            });
        }
    });

    serviceCheckboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            this.closest('.service-card').classList.toggle('selected', this.checked);
            if (servicesError) servicesError.style.display = 'none';
            updateStep1Progress();
        });
    });

    // Initial Step 1 progress update (starts at 0%)
    updateStep1Progress();

    // Validation for Step 1
    function validateStep1() {
        let isValid = true;
        let firstInvalid = null;

        // 1. Validate Name (Required)
        if (!nameInput.value.trim()) {
            nameInput.classList.add('input-error');
            if (nameError) nameError.style.display = 'block';
            if (!firstInvalid) firstInvalid = nameInput;
            isValid = false;
        }

        // 2. Validate Email (Required & valid format)
        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            emailInput.classList.add('input-error');
            if (emailError) emailError.style.display = 'block';
            if (!firstInvalid) firstInvalid = emailInput;
            isValid = false;
        }

        // 3. Validate Services (At least one selected)
        const isAnyServiceChecked = Array.from(serviceCheckboxes).some(cb => cb.checked);
        if (!isAnyServiceChecked) {
            if (servicesError) servicesError.style.display = 'block';
            if (!firstInvalid) firstInvalid = document.querySelector('.services-grid');
            isValid = false;
        }

        if (firstInvalid && typeof firstInvalid.focus === 'function') {
            firstInvalid.focus();
        }

        return isValid;
    }

    // ----------------------------------------------------
    // Step 2 Rating Interaction
    // ----------------------------------------------------
    let selectedRating = 0;
    const starBtns = document.querySelectorAll('.star-btn');
    const ratingScoreBadge = document.getElementById('rating-score-badge');
    const ratingScoreText = document.getElementById('rating-score-text');
    const ratingInput = document.getElementById('overall-rating-input');
    const labelItems = document.querySelectorAll('.star-label-item');

    function highlightStars(rating) {
        starBtns.forEach(btn => {
            const btnRating = parseInt(btn.getAttribute('data-rating'), 10);
            btn.classList.toggle('active', btnRating <= rating);
        });
    }

    function setRating(rating) {
        selectedRating = rating;
        if (ratingInput) ratingInput.value = rating;

        highlightStars(rating);

        if (ratingScoreText) {
            ratingScoreText.textContent = rating;
        }
        if (ratingScoreBadge) {
            ratingScoreBadge.classList.add('active');
        }

        // Highlight matching label in the labels row
        labelItems.forEach(item => {
            const itemRating = parseInt(item.getAttribute('data-for-rating'), 10);
            item.classList.toggle('active', itemRating === rating);
        });

        // Step 2 progress increases to 50% when rating is filled
        if (progressFill2) progressFill2.style.width = '50%';
        if (progressLabel2) progressLabel2.textContent = 'Step 2 of 4 (50%)';
    }

    starBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            const hoverRating = parseInt(this.getAttribute('data-rating'), 10);
            highlightStars(hoverRating);
        });

        btn.addEventListener('mouseleave', function () {
            highlightStars(selectedRating);
        });

        btn.addEventListener('click', function () {
            const clickRating = parseInt(this.getAttribute('data-rating'), 10);
            setRating(clickRating);
        });
    });

    // ----------------------------------------------------
    // Step 2: Rate Different Areas Interaction (Blue Stars)
    // ----------------------------------------------------
    const areaRows = document.querySelectorAll('.rating-area-row');
    const areaRatings = {};

    areaRows.forEach(row => {
        const areaKey = row.getAttribute('data-area');
        const areaStars = row.querySelectorAll('.area-star-btn');
        const areaBadge = row.querySelector('.area-score-badge');
        areaRatings[areaKey] = 0;

        function highlightAreaStars(rating) {
            areaStars.forEach(btn => {
                const btnRating = parseInt(btn.getAttribute('data-rating'), 10);
                btn.classList.toggle('active', btnRating <= rating);
            });
        }

        areaStars.forEach(btn => {
            btn.addEventListener('mouseenter', function () {
                const hoverRating = parseInt(this.getAttribute('data-rating'), 10);
                highlightAreaStars(hoverRating);
            });

            btn.addEventListener('mouseleave', function () {
                highlightAreaStars(areaRatings[areaKey]);
            });

            btn.addEventListener('click', function () {
                const clickRating = parseInt(this.getAttribute('data-rating'), 10);
                areaRatings[areaKey] = clickRating;
                highlightAreaStars(clickRating);
                if (areaBadge) {
                    areaBadge.textContent = `${clickRating} / 5`;
                    areaBadge.style.color = '#4109db';
                    areaBadge.style.borderColor = '#4109db';
                }
            });
        });
    });

    // ----------------------------------------------------
    // Step 3 Progress & Input Listeners
    // ----------------------------------------------------
    const attributeCheckboxes = document.querySelectorAll('input[name="attributes"]');

    function updateStep3Progress() {
        const hasText = likeMostInput && likeMostInput.value.trim().length > 0;
        const hasAnyAttribute = Array.from(attributeCheckboxes).some(cb => cb.checked);

        let added = 0;
        if (hasText) added += 15;
        if (hasAnyAttribute) added += 10;
        const percentage = 50 + added;

        if (progressFill3) {
            progressFill3.style.width = percentage + '%';
        }
        if (progressLabel3) {
            progressLabel3.textContent = `Step 3 of 4 (${percentage}%)`;
        }
    }

    if (likeMostInput) {
        likeMostInput.addEventListener('input', function () {
            this.classList.remove('input-error');
            if (likeMostError) likeMostError.style.display = 'none';
            updateStep3Progress();
        });
    }

    attributeCheckboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            this.closest('.attribute-pill').classList.toggle('selected', this.checked);
            updateStep3Progress();
        });
    });

    // ----------------------------------------------------
    // Step 4 Recommendation Cards Logic
    // ----------------------------------------------------
    recommendRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            recommendRadios.forEach(r => r.closest('.recommend-card').classList.remove('selected'));
            if (this.checked) {
                this.closest('.recommend-card').classList.add('selected');
                if (recommendError) recommendError.style.display = 'none';
            }
        });
    });

    // ----------------------------------------------------
    // Step 4 Permission Radios Logic
    // ----------------------------------------------------
    const permissionRadios = document.querySelectorAll('input[name="feature_permission"]');
    permissionRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            permissionRadios.forEach(r => r.closest('.permission-option-row').classList.remove('selected'));
            if (this.checked) {
                this.closest('.permission-option-row').classList.add('selected');
            }
        });
    });

    // ----------------------------------------------------
    // Navigation Functions
    // ----------------------------------------------------

    // Transition to Step 1
    function goToStep1() {
        if (step4) step4.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (step2) step2.style.display = 'none';
        if (formStepperHeader) formStepperHeader.style.display = 'block';
        if (step1) step1.style.display = 'block';

        // Revert Stepper Row
        stepIndicator1.className = 'step-item active';
        stepIcon1.textContent = '1';
        stepStatus1.textContent = 'In Progress';

        stepIndicator2.className = 'step-item';
        stepIcon2.textContent = '2';
        stepStatus2.textContent = 'Pending';

        stepIndicator3.className = 'step-item';
        stepIcon3.textContent = '3';
        stepStatus3.textContent = 'Pending';

        stepIndicator4.className = 'step-item';
        stepIcon4.textContent = '4';
        stepStatus4.textContent = 'Pending';

        updateStep1Progress();
        step1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Transition to Step 2
    function goToStep2() {
        if (step1) step1.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (step4) step4.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';
        if (step2) step2.style.display = 'block';

        // Stepper: 1 is completed (tick), 2 is in progress, 3 & 4 are pending
        stepIndicator1.className = 'step-item completed';
        stepIcon1.innerHTML = '&#10003;';
        stepStatus1.textContent = 'Completed';

        stepIndicator2.className = 'step-item active';
        stepIcon2.textContent = '2';
        stepStatus2.textContent = 'In Progress';

        stepIndicator3.className = 'step-item';
        stepIcon3.textContent = '3';
        stepStatus3.textContent = 'Pending';

        stepIndicator4.className = 'step-item';
        stepIcon4.textContent = '4';
        stepStatus4.textContent = 'Pending';

        // Step 2 Progress: Starts at 25%, goes to 50% if already rated
        if (selectedRating > 0) {
            if (progressFill2) progressFill2.style.width = '50%';
            if (progressLabel2) progressLabel2.textContent = 'Step 2 of 4 (50%)';
        } else {
            if (progressFill2) progressFill2.style.width = '25%';
            if (progressLabel2) progressLabel2.textContent = 'Step 2 of 4 (25%)';
        }

        step2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Transition to Step 3
    function goToStep3() {
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'none';
        if (step4) step4.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';
        if (step3) step3.style.display = 'block';

        // Stepper: Step 1 & 2 completed, Step 3 active (In Progress), Step 4 pending
        stepIndicator1.className = 'step-item completed';
        stepIcon1.innerHTML = '&#10003;';
        stepStatus1.textContent = 'Completed';

        stepIndicator2.className = 'step-item completed';
        stepIcon2.innerHTML = '&#10003;';
        stepStatus2.textContent = 'Completed';

        stepIndicator3.className = 'step-item active';
        stepIcon3.textContent = '3';
        stepStatus3.textContent = 'In Progress';

        stepIndicator4.className = 'step-item';
        stepIcon4.textContent = '4';
        stepStatus4.textContent = 'Pending';

        updateStep3Progress();
        if (step3) step3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Transition to Step 4 (One last thing)
    function goToStep4() {
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (stepSuccess) stepSuccess.style.display = 'none';
        if (step4) step4.style.display = 'block';

        // Stepper: Steps 1, 2, 3 completed with tick, Step 4 active (In Progress)
        stepIndicator1.className = 'step-item completed';
        stepIcon1.innerHTML = '&#10003;';
        stepStatus1.textContent = 'Completed';

        stepIndicator2.className = 'step-item completed';
        stepIcon2.innerHTML = '&#10003;';
        stepStatus2.textContent = 'Completed';

        stepIndicator3.className = 'step-item completed';
        stepIcon3.innerHTML = '&#10003;';
        stepStatus3.textContent = 'Completed';

        stepIndicator4.className = 'step-item active';
        stepIcon4.textContent = '4';
        stepStatus4.textContent = 'In Progress';

        if (progressFill4) progressFill4.style.width = '100%';
        if (progressLabel4) progressLabel4.textContent = 'Step 4 of 4 (100%)';

        if (step4) step4.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Button event listeners
    if (btnNextStep1) {
        btnNextStep1.addEventListener('click', function (e) {
            e.preventDefault();
            if (validateStep1()) {
                goToStep2();
            }
        });
    }

    if (btnBackStep2) {
        btnBackStep2.addEventListener('click', function (e) {
            e.preventDefault();
            goToStep1();
        });
    }

    if (btnNextStep2) {
        btnNextStep2.addEventListener('click', function (e) {
            e.preventDefault();
            if (selectedRating === 0) {
                alert('Please select a rating for your overall experience with BlueVe before continuing.');
            } else {
                goToStep3();
            }
        });
    }

    if (btnBackStep3) {
        btnBackStep3.addEventListener('click', function (e) {
            e.preventDefault();
            goToStep2();
        });
    }

    if (btnNextStep3) {
        btnNextStep3.addEventListener('click', function (e) {
            e.preventDefault();
            if (!likeMostInput.value.trim()) {
                likeMostInput.classList.add('input-error');
                if (likeMostError) likeMostError.style.display = 'block';
                likeMostInput.focus();
                return;
            }
            goToStep4();
        });
    }

    if (btnBackStep4) {
        btnBackStep4.addEventListener('click', function (e) {
            e.preventDefault();
            goToStep3();
        });
    }

    // Submit button on Step 4
    if (btnSubmitForm) {
        btnSubmitForm.addEventListener('click', function (e) {
            e.preventDefault();

            // Validate recommendation selection
            const isRecommendSelected = Array.from(recommendRadios).some(r => r.checked);
            if (!isRecommendSelected) {
                if (recommendError) recommendError.style.display = 'block';
                const firstCard = document.querySelector('.recommend-card');
                if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }

            // Gather all responses
            const selectedServices = Array.from(serviceCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => {
                    const card = cb.closest('.service-card');
                    const title = card ? card.querySelector('.service-name') : null;
                    return title ? title.textContent.trim() : cb.value;
                })
                .join(', ');

            const selectedAttributes = Array.from(document.querySelectorAll('input[name="attributes"]:checked'))
                .map(cb => {
                    const pill = cb.closest('.attribute-pill');
                    const label = pill ? pill.querySelector('.attribute-label') : null;
                    return label ? label.textContent.trim() : cb.value;
                })
                .join(', ');

            const recommendChoice = (() => {
                const checked = document.querySelector('input[name="recommend"]:checked');
                if (!checked) return '';
                const card = checked.closest('.recommend-card');
                const word = card ? card.querySelector('.recommend-main-word') : null;
                return word ? word.textContent.trim() : checked.value;
            })();

            const permissionChoice = (() => {
                const checked = document.querySelector('input[name="feature_permission"]:checked');
                return checked && checked.value === 'yes' ? 'Yes (Public)' : 'No (Private)';
            })();

            const submissionData = {
                timestamp: new Date().toLocaleString(),
                name: nameInput ? nameInput.value.trim() : '',
                company: companyInput ? companyInput.value.trim() : '',
                email: emailInput ? emailInput.value.trim() : '',
                services: selectedServices,
                overall_rating: selectedRating ? `${selectedRating} / 5` : '',
                communication: areaRatings['communication'] ? `${areaRatings['communication']} / 5` : '',
                design_quality: areaRatings['design_quality'] ? `${areaRatings['design_quality']} / 5` : '',
                development_quality: areaRatings['development_quality'] ? `${areaRatings['development_quality']} / 5` : '',
                understanding_requirements: areaRatings['understanding_requirements'] ? `${areaRatings['understanding_requirements']} / 5` : '',
                timely_delivered: areaRatings['timely_delivered'] ? `${areaRatings['timely_delivered']} / 5` : '',
                support_responsiveness: areaRatings['support_responsiveness'] ? `${areaRatings['support_responsiveness']} / 5` : '',
                like_most: likeMostInput ? likeMostInput.value.trim() : '',
                attributes: selectedAttributes,
                recommend: recommendChoice,
                testimonial: testimonialInput ? testimonialInput.value.trim() : '',
                feature_permission: permissionChoice
            };

            // 1. Save locally to browser localStorage so data is NEVER lost
            try {
                const storedList = JSON.parse(localStorage.getItem('blueve_feedback_responses') || '[]');
                storedList.push(submissionData);
                localStorage.setItem('blueve_feedback_responses', JSON.stringify(storedList));
                console.log('✅ Response saved to local storage:', submissionData);
            } catch (storageErr) {
                console.warn('LocalStorage save failed:', storageErr);
            }

            // 2. Send to Google Sheets if GOOGLE_SHEET_SCRIPT_URL is provided
            if (typeof GOOGLE_SHEET_SCRIPT_URL === 'string' && GOOGLE_SHEET_SCRIPT_URL.trim().length > 0) {
                const postParams = new URLSearchParams();
                for (const key in submissionData) {
                    postParams.append(key, submissionData[key]);
                }

                fetch(GOOGLE_SHEET_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: postParams.toString(),
                    mode: 'no-cors'
                }).then(() => {
                    console.log('✅ Response sent to Google Sheet successfully');
                }).catch(fetchErr => {
                    console.error('Error sending to Google Sheet:', fetchErr);
                });
            }

            // Testimonial is optional! Submit proceeds directly
            if (step4) step4.style.display = 'none';
            if (formStepperHeader) formStepperHeader.style.display = 'none';
            if (stepSuccess) stepSuccess.style.display = 'block';

            if (successClientName) {
                successClientName.textContent = nameInput.value.trim() || 'Valued Client';
            }

            // Stepper: All 4 steps Completed
            stepIndicator1.className = 'step-item completed';
            stepIcon1.innerHTML = '&#10003;';
            stepStatus1.textContent = 'Completed';

            stepIndicator2.className = 'step-item completed';
            stepIcon2.innerHTML = '&#10003;';
            stepStatus2.textContent = 'Completed';

            stepIndicator3.className = 'step-item completed';
            stepIcon3.innerHTML = '&#10003;';
            stepStatus3.textContent = 'Completed';

            stepIndicator4.className = 'step-item completed';
            stepIcon4.innerHTML = '&#10003;';
            stepStatus4.textContent = 'Completed';

            if (stepSuccess) stepSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Restart button on Success screen
    if (btnRestartForm) {
        btnRestartForm.addEventListener('click', function (e) {
            e.preventDefault();
            const form = document.querySelector('form');
            if (form) form.reset();
            serviceCheckboxes.forEach(cb => cb.closest('.service-card').classList.remove('selected'));
            attributeCheckboxes.forEach(cb => cb.closest('.attribute-pill').classList.remove('selected'));
            recommendRadios.forEach(r => r.closest('.recommend-card').classList.remove('selected'));
            permissionRadios.forEach(r => {
                r.closest('.permission-option-row').classList.toggle('selected', r.value === 'yes');
            });
            selectedRating = 0;
            if (ratingScoreText) ratingScoreText.textContent = '-';
            if (ratingScoreBadge) ratingScoreBadge.classList.remove('active');
            labelItems.forEach(item => item.classList.remove('active'));
            highlightStars(0);
            goToStep1();
        });
    }
});
