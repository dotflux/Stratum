const HomeBg = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#121212] to-[#1a1a1a] flex items-center justify-center absolute inset-0">
      {/* Optional: Soft Glow Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]"></div>
    </div>
  );
};

export default HomeBg;
