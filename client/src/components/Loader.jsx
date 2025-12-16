import React from "react";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      {/* Loader letters */}
      <div id="load">
        <div>G</div>
        <div>N</div>
        <div>I</div>
        <div>D</div>
        <div>A</div>
        <div>O</div>
        <div>L</div>
      </div>

      {/* Scoped CSS */}
      <style>
        {`
        /* =========================
           GLOBAL WRAPPER
        ========================== */
        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
          background: #ffffff; /* ✅ FOND BLANC */
          overflow: hidden;
        }

        /* =========================
           LOADER CONTAINER
        ========================== */
        #load {
          position: relative;
          width: 600px;
          height: 36px;
          user-select: none;
          cursor: default;
        }

        /* =========================
           LETTER STYLE
        ========================== */
        #load div {
          position: absolute;
          width: 20px;
          height: 36px;
          opacity: 0;
          font-family: Helvetica, Arial, sans-serif;
          font-size: 32px;
          font-weight: bold;
          color: #35C4F0; /* contraste parfait sur fond blanc */
          transform: rotate(180deg);
          animation: move 2s linear infinite;
        }

        /* =========================
           ANIMATION DELAYS
        ========================== */
        #load div:nth-child(2) { animation-delay: 0.2s; }
        #load div:nth-child(3) { animation-delay: 0.4s; }
        #load div:nth-child(4) { animation-delay: 0.6s; }
        #load div:nth-child(5) { animation-delay: 0.8s; }
        #load div:nth-child(6) { animation-delay: 1s; }
        #load div:nth-child(7) { animation-delay: 1.2s; }

        /* =========================
           KEYFRAMES
        ========================== */
        @keyframes move {
          0% {
            left: 0;
            opacity: 0;
            transform: rotate(180deg);
          }
          35% {
            left: 41%;
            opacity: 1;
            transform: rotate(0deg);
          }
          65% {
            left: 59%;
            opacity: 1;
            transform: rotate(0deg);
          }
          100% {
            left: 100%;
            opacity: 0;
            transform: rotate(-180deg);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Loader;
