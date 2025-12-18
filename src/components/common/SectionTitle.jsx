const SectionTitle = ({ title, subtitle,span }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance text-[#38909D]">{title} <span className="text-[#F6851F]">{span}</span></h2>
      {subtitle && <p className="text-base-content/70 max-w-2xl mx-auto text-pretty">{subtitle}</p>}
    </div>
  )
}

export default SectionTitle
