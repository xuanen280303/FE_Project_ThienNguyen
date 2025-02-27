<template>
    <div class="w-screen h-screen z-[9999] fixed top-0 left-0 bg-surface-0 dark:bg-surface-900 flex items-center justify-center bg-white/90">
        <div class="loading">
            <div class="diamond"></div>
            <div class="diamond middle"></div>
            <div class="diamond"></div>
        </div>
    </div>
</template>
<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.diamond {
    width: 50px;
    height: 50px;
    background-color: orange;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    margin: 5px;
    opacity: 0;
    animation: fade-in-out 1.5s ease-in-out infinite;
}

.diamond.middle {
    transform: rotateY(180deg);
}

@keyframes fade-in-out {
    0%,
    100% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
}

.diamond {
    background: linear-gradient(45deg, #ffba00, #ff6c00);
}

.diamond:nth-child(1) {
    animation-delay: 0s;
}

.diamond.middle {
    animation-delay: 0.5s;
}

.diamond:nth-child(3) {
    animation-delay: 1s;
}
</style>
