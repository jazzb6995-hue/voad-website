const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const NEW_POSTS = [

  /* ── 1. COMMERCIAL OFFICE INTERIOR ─────────────────────── */
  {
    id: 'commercial-office-interior-rajkot',
    title: 'Commercial Office Interior Design in Rajkot: What Your Workspace Says About Your Business',
    excerpt: 'Your office interior communicates more than you think. Here is what businesses in Rajkot need to consider before designing a workspace that actually works.',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-10',
    author: 'Ar. Vivek Bosmiya',
    tags: ['commercial interior', 'office design', 'Rajkot', 'workspace'],
    related: ['architect-vs-interior-designer', 'turnkey-interior-what-it-means', 'interior-design-cost-guide-2026'],
    content: `
      <p>Walk into most offices in Rajkot and you will find one of two things. Either a space that was set up quickly with whatever furniture was available, or a space that was designed to impress visitors but makes no practical sense for the people who work there every day. Neither serves the business well.</p>

      <p>A well-designed commercial office does three things at once. It makes your team more productive, it communicates your brand to every client who walks in, and it recruits talent simply by looking like a place people want to spend time. These are not soft benefits. They have direct effects on your bottom line.</p>

      <h2>The First Thing Most Businesses Get Wrong</h2>

      <p>The most common mistake in office design is treating space planning as an afterthought. Businesses decide how many people they need to seat, buy desks accordingly, and then wonder why the space feels chaotic. Space planning is not just about fitting furniture. It is about understanding how people actually move through a space, where collaboration happens, where focused work needs to happen, and where clients should and should not go.</p>

      <p>A reception area that feels cramped sends a message before you say a single word. A meeting room that seats eight but only ever uses four is wasted real estate. A team floor where everyone can hear every phone call is a productivity disaster.</p>

      <h2>Zoning: The Core of Good Office Design</h2>

      <p>At VOAD, we approach every commercial project with a zoning exercise before we touch a single material or finish. The zones in a typical Rajkot office look like this:</p>

      <ul>
        <li><strong>Reception and client zone:</strong> This is your brand. It should feel polished, comfortable, and reflect your company identity. Natural light matters here.</li>
        <li><strong>Collaboration zone:</strong> Open, flexible, easy to reconfigure. Good acoustics, writable surfaces, screen access.</li>
        <li><strong>Focus zone:</strong> Quieter, with visual separation from high-traffic areas. Not necessarily enclosed, but clearly defined.</li>
        <li><strong>Utility zone:</strong> Pantry, storage, server room, printing. These should be accessible but not visible from the client path.</li>
      </ul>

      <h2>Materials and Climate</h2>

      <p>Rajkot gets hot. Office spaces that ignore this end up with either sky-high AC bills or uncomfortable teams. Thoughtful material choices make a real difference. Light-coloured wall finishes reduce heat absorption. Good window placement with the right shading cuts solar gain. Flooring that does not retain heat keeps the space cooler through the day.</p>

      <p>We also specify acoustic materials carefully in commercial projects. Open-plan offices are productive only when the acoustic design supports them. Without it, they are just noisy.</p>

      <h2>Branding Through Interior Design</h2>

      <p>Your office does not need to plaster your logo on every wall to communicate your brand. It communicates through the quality of finishes, the coherence of the colour palette, the way light falls in a space, and the small details like the furniture profile and the texture of a surface.</p>

      <p>A law firm and a creative agency will make very different choices, and both will be right for their context. What matters is that the choices are intentional, not random.</p>

      <h2>What Does Commercial Office Interior Design Cost in Rajkot?</h2>

      <p>For a mid-range commercial office fit-out in Rajkot, expect to spend between Rs 1,200 and Rs 2,500 per square foot depending on the finish level, structural changes required, and furniture specification. A 2,000 sq ft office at a mid-range spec typically comes to Rs 25 to 40 lakh for a complete turnkey fit-out.</p>

      <p>That figure sounds significant until you calculate what a poorly designed space costs in staff turnover, lost productivity, and the impression it leaves on clients.</p>

      <h2>Starting a Commercial Interior Project</h2>

      <p>The best time to involve an interior designer in an office project is before you sign a lease, not after. Floor plate shape, natural light access, and column placement all affect how well a space can be designed. If you are already committed to a space, the second best time is before you buy any furniture.</p>

      <p>At VOAD, we have handled commercial interiors for corporate offices, showrooms, and retail spaces across Rajkot and Gujarat. If you are planning a new office or a refurbishment, we are happy to start with a simple conversation about what you need the space to do.</p>
    `
  },

  /* ── 2. HERITAGE HAVELI RENOVATION ─────────────────────── */
  {
    id: 'heritage-haveli-renovation-rajkot',
    title: 'Heritage Haveli Renovation in Gujarat: What to Expect Before You Start',
    excerpt: 'Renovating a heritage haveli or old bungalow in Gujarat is a different process from a standard project. Here is an honest look at the challenges and rewards.',
    cover: 'https://images.unsplash.com/photo-1565793979943-c280d87c4879?auto=format&fit=crop&w=1200&q=80',
    date: '2026-11-03',
    author: 'Ar. Vivek Bosmiya',
    tags: ['heritage renovation', 'haveli', 'Gujarat', 'restoration', 'architecture'],
    related: ['heritage-haveli-restoration-gujarat', 'vastu-and-modern-design', 'architect-vs-interior-designer'],
    content: `
      <p>Gujarat has some of the most architecturally significant residential buildings in India. Old havelis with intricate jali work, pre-independence bungalows with deep verandas, and merchant houses built around internal courtyards. Many of these are still standing, often in families for three or four generations.</p>

      <p>When a family decides to renovate rather than demolish, they are making a decision that goes beyond the practical. They are choosing to preserve something that cannot be rebuilt. But heritage renovation is not like standard construction, and families who approach it without understanding the differences often end up frustrated, over budget, or both.</p>

      <h2>Start With a Thorough Assessment</h2>

      <p>Before any design work begins, the structure needs to be assessed properly. This is not a standard site visit. It includes checking the foundation condition, mapping any structural cracks, identifying original materials, documenting all existing features, and understanding which elements are load-bearing.</p>

      <p>Many old buildings in Gujarat used lime mortar, which behaves very differently from cement. Applying cement over lime plaster can trap moisture and cause the original structure to deteriorate from the inside. An architect who has not worked with heritage structures may not know this. It is worth asking specifically about experience with pre-1950 construction.</p>

      <h2>What You Are Allowed to Change</h2>

      <p>If the property is listed as a heritage structure under the Gujarat Heritage Conservation Committee or the Archaeological Survey of India, there are legal constraints on what can be altered. External facades, significant ornamental elements, and structural members may require approval before any work begins.</p>

      <p>Even if the property is not formally listed, the local municipal authority may have guidelines. We always advise clients to clarify this before committing to any design direction, since discovering a constraint mid-project is expensive.</p>

      <h2>Preserving What Matters</h2>

      <p>The most important part of a heritage renovation is deciding what to keep and why. Original teak joinery, hand-laid stone flooring, decorative plasterwork, wooden columns with carved capitals. These elements are not replaceable. Once they are gone, they are gone.</p>

      <p>At VOAD, our approach is to treat original features as fixed points in the design. The new elements are designed around them, not the other way around. A new kitchen can be modern. The original courtyard proportions should be respected.</p>

      <h2>Integrating Modern Services</h2>

      <p>One of the practical challenges in heritage renovation is running new electrical, plumbing, and HVAC systems through buildings that were not designed to accommodate them. Concealing conduits and pipes without damaging original surfaces requires careful planning and experienced site supervision.</p>

      <p>We use a services coordination drawing for every heritage project, mapping exactly where each service run will go and how it will be concealed before any work starts on site. It takes more time upfront but prevents the alternative, which is cables running visibly across carved plasterwork.</p>

      <h2>Timelines and Costs</h2>

      <p>Heritage renovation takes longer and costs more per square foot than new construction. This is not a negotiating position. It reflects reality. Skilled craftspeople who can replicate lime plaster finishes, restore teak joinery, or repair original stone flooring are not interchangeable with standard site labour.</p>

      <p>A realistic timeline for a substantial haveli renovation in Gujarat is 18 to 30 months depending on scope. Costs vary widely with condition and finish level, but clients should budget at least 30 to 40 percent more per square foot than a comparable new-build.</p>

      <h2>Is It Worth It?</h2>

      <p>When done well, a renovated haveli or heritage bungalow offers something no new building can. The scale, the craftsmanship, the material character, and the connection to history are simply not available in new construction at any price.</p>

      <p>If you are considering a heritage renovation project in Gujarat, we would be glad to discuss it. These are among the most rewarding projects we work on.</p>
    `
  },

  /* ── 3. TURNKEY INTERIOR WHAT IT MEANS ─────────────────── */
  {
    id: 'turnkey-interior-what-it-means',
    title: 'Turnkey Interior Design: What It Actually Covers (And What It Does Not)',
    excerpt: 'Turnkey gets used loosely in the interior design industry. Before you sign any agreement, here is exactly what the term should and should not include.',
    cover: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-27',
    author: 'Ar. Vivek Bosmiya',
    tags: ['turnkey interior', 'interior design', 'Rajkot', 'home design', 'project management'],
    related: ['turnkey-project-honest-guide', 'interior-design-cost-guide-2026', 'how-long-does-a-design-project-take'],
    content: `
      <p>Turnkey is one of the most used and most misunderstood terms in Indian interior design. Some firms use it to mean they will handle everything from design to handover. Others use it to mean they will provide a quote that includes furniture. The gap between these two definitions can cost a client lakhs and months of frustration.</p>

      <p>This post explains what a genuine turnkey interior project covers, what reasonable exclusions look like, and what questions to ask before you commit.</p>

      <h2>What Turnkey Should Mean</h2>

      <p>In its proper sense, turnkey means a single point of responsibility from design to handover. You hand over the keys at the start, and you get them back at the end with the space complete and ready to use. Everything in between is the firm's responsibility.</p>

      <p>That includes design and documentation, all civil and carpentry work, electrical and lighting, plumbing modifications if required, false ceiling and wall treatments, flooring, all furniture (custom and loose), fixtures and fittings, soft furnishings, accessories, and final styling. When you walk in at handover, the space is ready.</p>

      <h2>What Is Reasonably Excluded</h2>

      <p>Even in a true turnkey project, some items are typically excluded. Structural changes to the building, such as removing load-bearing walls, are usually handled separately and require structural engineering input. External facade work, if not part of the brief, is excluded. Major electrical panel upgrades may fall outside scope if they require building-level approvals.</p>

      <p>These exclusions should be explicitly listed in the agreement, not left as assumptions. If a firm's quote says "turnkey" but does not define what is excluded, ask them to list the exclusions in writing.</p>

      <h2>The Difference Between Turnkey and Design-Only</h2>

      <p>A design-only engagement means the firm produces drawings, specifications, and schedules. You then coordinate contractors, supervise work, manage procurement, and handle site issues yourself. This is significantly cheaper but requires substantial time and knowledge on your part.</p>

      <p>A turnkey engagement costs more because you are paying for coordination, supervision, procurement management, and the accountability that comes with a single responsible party. For most homeowners and businesses, the premium is worth it. Managing a multi-agency interior project without experience is genuinely difficult.</p>

      <h2>How Turnkey Pricing Works</h2>

      <p>Turnkey interior projects are typically quoted as a total cost covering everything within scope. Some firms quote design fees separately and construction costs separately. Others roll everything into a single project cost.</p>

      <p>Either approach is fine as long as the breakdown is clear. What you want to avoid is an artificially low headline number with a long list of "extra" items that appear later. Ask for a bill of quantities with unit rates for key items so you can compare quotes on a like-for-like basis.</p>

      <h2>What to Check in Any Turnkey Agreement</h2>

      <p>Before signing, make sure the agreement covers these points specifically:</p>

      <ul>
        <li>A clear scope of work listing every area and every category of work included</li>
        <li>An explicit list of exclusions</li>
        <li>Payment milestones tied to completion stages, not arbitrary dates</li>
        <li>A defined handover standard, meaning what "complete" looks like</li>
        <li>A defect liability period after handover, typically 12 months</li>
        <li>Clarity on who owns the design documents</li>
      </ul>

      <h2>How VOAD Handles Turnkey Projects</h2>

      <p>At VOAD, our turnkey projects are managed as a single accountable engagement. We handle design, all contractor coordination, procurement, and site supervision. The client receives progress updates at defined milestones and is involved in key decisions like material selections and furniture approvals.</p>

      <p>What we do not do is disappear after handing over drawings. If you have questions about how a turnkey project works in practice, we are happy to walk you through our process before you decide anything.</p>
    `
  },

  /* ── 4. RESIDENTIAL ARCHITECTURE RAJKOT ────────────────── */
  {
    id: 'residential-architecture-rajkot',
    title: 'Residential Architecture in Rajkot: Planning a Home That Works for Gujarat',
    excerpt: 'Building a home in Rajkot requires more than a floor plan. Climate, plot orientation, family lifestyle, and local material availability all shape the right design.',
    cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-20',
    author: 'Ar. Vivek Bosmiya',
    tags: ['residential architecture', 'Rajkot', 'home design', 'Gujarat', 'bungalow'],
    related: ['bungalow-vs-villa-gujarat-climate', 'vastu-and-modern-design', 'how-much-space-does-a-home-need'],
    content: `
      <p>Residential architecture in Rajkot sits at an interesting intersection. The city is growing fast, land values are rising, and families are building new homes with serious budgets and high expectations. At the same time, there is a strong local culture around how a home should feel, how guests should be received, and how the family should live across generations.</p>

      <p>Getting the architecture right means understanding both the technical requirements and the life that will be lived in the space. This post covers the key decisions in a residential architecture project and what to think about before the design process starts.</p>

      <h2>Start With the Site, Not the Sketch</h2>

      <p>The first thing we do on any residential project is a thorough site analysis. This covers orientation (which direction the plot faces), natural ventilation paths, solar exposure through the day, existing trees or structures that affect the design, neighbourhood context, and access constraints.</p>

      <p>Rajkot's climate means that east-west orientation of the main living spaces matters significantly. A living room that faces west will be uncomfortably hot through summer afternoons unless it is designed with effective shading. A bedroom that gets no natural ventilation will rely entirely on mechanical cooling. These are architecture problems, not interior design problems, and they need to be solved at the planning stage.</p>

      <h2>Floor Plan Logic</h2>

      <p>The floor plan of a home is its most permanent decision. Walls can be repainted and furniture can be replaced, but restructuring a floor plan after construction is expensive and disruptive. Spending time on the plan before anything is built is the highest-value investment in any project.</p>

      <p>For Rajkot families, some common floor plan priorities we see: a double-height or generous entry that creates a sense of arrival, a living room that can accommodate large family gatherings, a kitchen that works for both daily cooking and larger meals, bedrooms with attached bathrooms, and either a home office or a flexible room that can serve multiple purposes.</p>

      <p>Multigenerational households, which remain common in Rajkot, need additional thought around privacy, shared spaces, and future flexibility as family composition changes.</p>

      <h2>Structure and Materials</h2>

      <p>Most new residential construction in Rajkot uses RCC framed structures. Within that, there is significant variation in quality. Column sizing, beam depths, slab thickness, and reinforcement all affect the long-term performance of the building. These are decisions made in structural drawings, not architectural drawings, and they require a qualified structural engineer.</p>

      <p>For external materials, locally available stone performs well in the Gujarat climate. It has thermal mass, ages well, and is available in a range of finishes. Contemporary homes increasingly combine stone with exposed concrete, large-format tiles, and aluminium composite panels for a material palette that reads as modern while remaining practical.</p>

      <h2>Vastu and Modern Design</h2>

      <p>Vastu considerations are important to most families building in Rajkot. It is entirely possible to design a home that respects Vastu principles and still functions well architecturally. The two are not in conflict when the design is handled thoughtfully from the start.</p>

      <p>Where difficulties arise is when Vastu recommendations are applied to an existing design that was developed without considering them. Retrofitting orientation changes into a completed plan rarely works cleanly. The right approach is to incorporate Vastu principles as part of the site analysis and planning stage.</p>

      <h2>How Long Does a Residential Architecture Project Take?</h2>

      <p>From initial brief to construction completion, a typical bungalow in Rajkot takes 24 to 36 months. Design and approvals take 4 to 6 months depending on plot size and local authority timelines. Construction takes 14 to 20 months for a well-managed site. Interior finishing adds 3 to 6 months on top of that.</p>

      <p>Rushing any of these phases produces problems that are expensive to fix later. The design and planning stage in particular deserves adequate time, since decisions made there affect everything that follows.</p>

      <h2>Working With an Architect in Rajkot</h2>

      <p>If you are planning a home in Rajkot, involving an architect early is the most cost-effective decision you can make. The fee for good architecture is small relative to the total project cost and the savings that come from avoiding mistakes. We work on residential projects from plot selection through to handover. If you are at the early stage of thinking about a new home, we are glad to have that conversation.</p>
    `
  },

  /* ── 5. LUXURY INTERIOR DESIGN RAJKOT ──────────────────── */
  {
    id: 'luxury-interior-design-rajkot',
    title: 'Luxury Interior Design in Rajkot: What It Actually Looks Like in Practice',
    excerpt: 'Luxury in interior design is not about spending more. It is about precision, restraint, and materials that reward close attention. Here is what that means for homes in Rajkot.',
    cover: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-13',
    author: 'Ar. Vivek Bosmiya',
    tags: ['luxury interior design', 'Rajkot', 'high-end interior', 'premium home design', 'Gujarat'],
    related: ['interior-design-cost-guide-2026', 'why-some-rooms-feel-right', 'why-instagram-interior-designs-fail'],
    content: `
      <p>Luxury interior design is one of the most searched and least understood categories in the Indian home design market. Instagram and project portfolios have created a visual language around it: marble surfaces, chandeliers, gold accents, and large sectional sofas. But the homes that actually read as luxurious in person rarely match that checklist.</p>

      <p>Genuine luxury in interior design is about something more precise. It is about spatial quality, material integrity, and the kind of detailing that you feel rather than notice. This post explains what that actually means for a home in Rajkot.</p>

      <h2>Luxury Starts With Space</h2>

      <p>The most reliable signal of a high-end interior is generous proportions. Ceiling heights above 10 feet. Wide doorways. Rooms that feel comfortable with furniture in them, not just in photographs. Corridors and circulation areas that do not feel like afterthoughts.</p>

      <p>These are decisions made at the architectural stage. If the architecture is generous, the interior has a natural advantage. If the architecture is cramped, no amount of expensive materials will produce a genuinely luxurious feel. This is worth understanding before you budget for finishes.</p>

      <h2>The Role of Materials</h2>

      <p>High-quality materials are part of luxury design, but material cost is not the same as material quality. The difference between a good marble application and a mediocre one is not the stone. It is the slab selection, the layout planning to work with the natural veining, the precision of the cutting, and the quality of the installation.</p>

      <p>At VOAD, we specify materials with their application method and installation standard, not just their product code. A Rs 300 per square foot tile laid with precision and consistent grout lines will look better than a Rs 600 per square foot tile laid carelessly.</p>

      <p>Materials that perform well in Rajkot's climate and also carry a luxury quality: natural stone, solid wood (particularly teak and walnut), brushed brass hardware, acoustic plaster, and large-format porcelain. These age well and feel genuinely premium over time.</p>

      <h2>Lighting Design Is Not Optional</h2>

      <p>The single most common shortcut in Indian residential interiors is lighting design. Most homes get a combination of recessed downlights and a decorative fitting in each room. This produces flat, undifferentiated light that makes even expensive finishes look ordinary.</p>

      <p>Luxury lighting design creates layers: ambient light for general illumination, task light for work surfaces, accent light to highlight architecture and artwork, and decorative light for visual interest. Each layer is controlled independently. The right combination for a space in the evening is different from what works in the morning.</p>

      <p>Good lighting design adds 3 to 5 percent to an interior project budget. Its impact on how the space feels is disproportionately large.</p>

      <h2>Restraint Is a Design Choice</h2>

      <p>The most common mistake in luxury residential design is trying to signal value through accumulation. More materials, more patterns, more decorative elements, more furniture. The result is a space that feels busy rather than refined.</p>

      <p>Restraint is not the same as minimalism. A space can be warm, layered, and richly furnished while still maintaining clarity. The discipline is in knowing what to leave out. A single well-chosen piece of art on an otherwise quiet wall communicates more than a gallery wall of average prints.</p>

      <h2>Custom Work vs Catalogue</h2>

      <p>High-end interiors typically combine custom-designed joinery and furniture with carefully selected catalogue pieces. Custom work gives you precision fit, bespoke dimensions, and control over every detail. Good catalogue pieces bring quality manufacturing and sometimes design pedigree that adds to the overall character of a space.</p>

      <p>What we avoid is using catalogue furniture as a substitute for design thinking. The question is never "which sofa from which catalogue." It is "what does this room need, what size and form, what material, what relationship to the other pieces, and which source best meets those requirements."</p>

      <h2>What to Budget for Luxury Interior Design in Rajkot</h2>

      <p>A luxury interior fit-out in Rajkot for a well-appointed home typically starts at Rs 3,500 per square foot and goes upward depending on material specification and the proportion of custom work. For a 4,000 sq ft bungalow, that is a starting point of Rs 1.4 crore for the interior alone.</p>

      <p>These numbers reflect real material and labour costs. Quotes significantly below this range for a full luxury specification usually mean something is missing from the scope or quality assumptions have been made that will surface during execution.</p>

      <p>If you are considering a high-end interior project in Rajkot, we are happy to have a detailed conversation about scope, approach, and realistic expectations.</p>
    `
  },

  /* ── 6. RENOVATION VS NEW CONSTRUCTION ─────────────────── */
  {
    id: 'renovation-vs-new-construction',
    title: 'Renovation vs New Construction: An Honest Guide for Gujarat Homeowners',
    excerpt: 'Should you renovate your existing home or build from scratch? The answer is different for every situation. Here is how to think through it properly.',
    cover: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-06',
    author: 'Ar. Vivek Bosmiya',
    tags: ['home renovation', 'Rajkot', 'Gujarat', 'new construction', 'renovation vs rebuild'],
    related: ['how-long-does-a-design-project-take', 'why-home-design-costs-vary', 'turnkey-interior-what-it-means'],
    content: `
      <p>It is one of the most common questions families ask when they outgrow their home or inherit an older property. Should we renovate what we have, or tear it down and build fresh? Both paths have real advantages and genuine drawbacks, and the right answer depends on factors that are specific to your situation.</p>

      <p>This guide lays out how to think through the decision honestly, without pushing you toward either option.</p>

      <h2>Start With the Structure</h2>

      <p>The single most important factor in the renovation versus rebuild decision is the condition of the existing structure. A building with a sound RCC frame, no significant foundation movement, and no major structural cracks is a good candidate for renovation. A building with compromised foundation, severe structural deterioration, or columns and beams that do not meet current load requirements may cost more to repair than to replace.</p>

      <p>This assessment requires a structural engineer, not just a contractor's opinion. Contractors have incentives in both directions, depending on what kind of work they prefer. An independent structural engineer will give you an honest assessment of what the building can and cannot do.</p>

      <h2>When Renovation Makes More Sense</h2>

      <p>Renovation is usually the better choice when:</p>

      <ul>
        <li>The structure is sound and can accommodate the changes you need</li>
        <li>The plot has constraints that make demolition and rebuild complicated, such as shared walls or access limitations</li>
        <li>The existing building has features worth preserving, like high ceilings, good proportions, original materials, or heritage character</li>
        <li>You need to continue living in part of the building during the work</li>
        <li>The timeline for a full rebuild is not acceptable</li>
      </ul>

      <p>Renovation is also typically less disruptive for established neighbourhoods where the existing home already has the right scale and character for its setting.</p>

      <h2>When New Construction Makes More Sense</h2>

      <p>Building from scratch is usually the better choice when:</p>

      <ul>
        <li>The existing structure has significant deficiencies that would be expensive to address</li>
        <li>Your brief requires changes to the floor plan that are not achievable within the existing layout without major structural work</li>
        <li>The existing building is simply not large enough for what you need</li>
        <li>You want to take advantage of current building technology, materials, and energy performance standards that an older building cannot easily accommodate</li>
        <li>The total cost of renovation to achieve what you want comes close to or exceeds the cost of rebuilding</li>
      </ul>

      <h2>The Cost Comparison</h2>

      <p>Many families assume renovation is automatically cheaper than rebuilding. This is often not true. Renovation involves working around existing constraints, dealing with unforeseen conditions that only become visible once work starts, and the inefficiency of modifying rather than constructing cleanly.</p>

      <p>A realistic rule: if the renovation scope covers more than 60 to 70 percent of the building, the cost difference between renovation and rebuild often narrows to less than 20 percent. At that point, the question becomes whether that 20 percent premium for a new build is worth the advantages it brings.</p>

      <p>Get detailed quotes for both options before deciding. The number that comes back will often make the decision obvious.</p>

      <h2>The Time Factor</h2>

      <p>Renovation is not necessarily faster than new construction. A substantial renovation can take as long as a new build and sometimes longer, because unforeseen conditions add time that was not in the original programme. The difference is that renovation can sometimes be phased, allowing you to remain in part of the building while work progresses elsewhere.</p>

      <h2>Approvals and Permissions</h2>

      <p>Both renovation and new construction require building permissions from the local authority in Rajkot. New construction requires full building plan approval. Renovation that involves structural changes also requires approval. Internal finishing work typically does not.</p>

      <p>If your property is in a heritage zone or has heritage listing, additional approvals may be needed regardless of whether you are renovating or rebuilding. Check this early in the process.</p>

      <h2>Getting the Right Advice</h2>

      <p>The honest answer to renovation versus rebuild is that it depends, and the dependency is on factors that require professional assessment to evaluate properly. At VOAD, we have handled both extensively and we do not have a preference either way. What we care about is getting to the right answer for your specific situation.</p>

      <p>If you are facing this decision, we are happy to look at your property and brief and give you an objective view of which direction makes more sense.</p>
    `
  }

];

module.exports = async function handler(req, res) {
  if (req.query.secret !== 'voad-seed-blogs2-2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existing = await redis.get('voad:blogs') || [];
  const existingIds = new Set(existing.map(b => b.id));

  const toAdd = NEW_POSTS.filter(p => !existingIds.has(p.id));
  const updated = [...existing, ...toAdd];
  await redis.set('voad:blogs', updated);

  return res.json({ ok: true, added: toAdd.length, ids: toAdd.map(p => p.id) });
};
