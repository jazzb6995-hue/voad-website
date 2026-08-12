const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const KEY = 'voad:blogs';

const NEW_BLOGS = [
  {
    id: 'architect-ahmedabad',
    title: 'Looking for an Architect in Ahmedabad? Here Is What to Ask First',
    excerpt: 'Most families in Ahmedabad spend months browsing portfolios before they talk to an architect. Here is a clearer way to approach the decision.',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    author: 'Ar. Vivek Bosmiya',
    date: '2026-08-12',
    category: 'Architecture',
    readTime: '6 min read',
    published: true,
    content: `<p>Ahmedabad is one of India's oldest and most architecturally rich cities. It is also one where the gap between good architecture and average construction is wide and visible. When you are building something of your own, the choice of who designs it matters more than most people realise.</p>

<h2>Why the city makes different demands</h2>
<p>Ahmedabad runs hot. The west-facing elevation that looks dramatic in a showroom mock-up becomes a furnace by 3 pm. Glazing that works in coastal cities traps heat here. Local sandstone, on the other hand, breathes and ages well. A good architect in Ahmedabad knows these things not because they read about them but because they have dealt with them on site.</p>
<p>The city also has a particular relationship with density. Older walled-city homes pack extraordinary warmth and community into tight footprints. Newer areas like Bopal, Prahlad Nagar, and South Bopal have room to breathe but can feel disconnected. How a designer handles both contexts says something about their range.</p>

<h2>What to ask before you sign anything</h2>
<p>Before you pick an architecture or interior design firm in Ahmedabad, three questions are worth asking directly:</p>
<ul>
  <li><strong>Who will be on site during construction?</strong> Many firms sign the drawings and hand the project to a site supervisor you have never met. Ask specifically who handles site visits and how often.</li>
  <li><strong>How many projects are you currently running?</strong> A studio managing 40 projects simultaneously cannot give yours the attention a studio managing 8 can. There is no right number, but you should know what you are getting into.</li>
  <li><strong>Can I speak with a past client?</strong> Portfolios show best-case work. A conversation with someone who went through the full process will tell you far more.</li>
</ul>

<h2>What credentials actually mean</h2>
<p>Council of Architecture registration is the basic professional requirement. Beyond that, look at the body of work rather than the awards. A project that photographs well but was delivered six months late and 40 percent over budget is not a success for the client. Ask about budget adherence as directly as you ask about aesthetics.</p>

<h2>Why some Ahmedabad clients work with studios outside the city</h2>
<p>It is common for Ahmedabad families to commission architects or interior designers from other Gujarat cities when they want a specific kind of work that is harder to find locally. Heritage-sensitive design, highly crafted turnkey interiors, and certain kinds of modernist residential architecture are sometimes better sourced from studios with a track record in those areas, even if those studios are based in Rajkot, Vadodara, or Surat.</p>
<p>VOAD is based in Rajkot and has worked with clients in Ahmedabad. Ar. Vivek Bosmiya travels to site for every project. If you are working through a brief for a home or office in Ahmedabad and would like to have a conversation, you can reach us at the <a href="/contact">contact page</a>.</p>

<h2>One thing most guides leave out</h2>
<p>The best thing you can do before your first architect meeting is spend time in homes you genuinely love. The things you notice and the things that put you at ease are data. A good architect will ask about them. If they do not ask, that is also information.</p>`
  },
  {
    id: 'interior-designer-surat',
    title: 'Interior Designer in Surat: Why More Families Are Going Custom',
    excerpt: "Surat's residential market has changed. The readymade interior that worked five years ago no longer fits what families here want. Custom design is catching up fast.",
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    author: 'Ar. Vivek Bosmiya',
    date: '2026-08-10',
    category: 'Interior Design',
    readTime: '5 min read',
    published: true,
    content: `<p>Surat moves fast. The city's diamond and textile trades have made it one of India's wealthiest cities by per-capita income, and that wealth is increasingly going into homes. The readymade interior that was good enough five years ago no longer fits what Surat's families are asking for. Custom design is becoming the expectation, not the exception.</p>

<h2>What "custom" actually means here</h2>
<p>Custom interior design is not simply about spending more money. It means every decision in your home, from the storage layout in the bedroom to the way light falls in the living room at 6 pm, was made with your specific household in mind. A family of five with young children has different needs from a couple who entertain regularly. No catalogue can account for both.</p>
<p>In Surat, where new residential construction is moving at pace, the trap is buying a beautiful-looking flat and filling it with whatever the furniture showroom has on display. The result is a home that looks like everyone else's and works for no one in particular.</p>

<h2>What good interior designers in Surat are being asked to solve</h2>
<p>The most common briefs from Surat clients right now cluster around a few themes:</p>
<ul>
  <li><strong>Storage that does not look like storage.</strong> Larger families need a lot of it, but nobody wants their home to look like a warehouse. Integrating storage intelligently into walls, beds, and staircases takes planning that happens before the first piece of furniture arrives.</li>
  <li><strong>Spaces that shift between uses.</strong> A home office that becomes a guest room. A pooja space integrated into the living area without overwhelming it. Flexibility without compromise is a design challenge, not just an execution one.</li>
  <li><strong>Warmth without heaviness.</strong> Surat's climate is humid. Heavy fabrics and dark wood finishes that feel luxurious in cooler climates can feel oppressive here. The right materials make a real difference.</li>
</ul>

<h2>How to evaluate an interior designer before committing</h2>
<p>The portfolio is the obvious starting point, but look specifically for projects that match your context. A designer who has only done offices and cafes may not have the residential sensibility you need. Ask to see projects of a similar size and type to yours.</p>
<p>Timeline and budget discipline matter as much as aesthetics. Ask how they handle variation orders, which are additions or changes you make during the project, and what typical overages look like. An honest answer here is more valuable than a reassuring one.</p>

<h2>Does it matter where your designer is based?</h2>
<p>What matters is the work, the process, and whether the designer will show up when it matters. VOAD is based in Rajkot and we have completed interior design projects for clients across Gujarat, including Surat. Ar. Vivek Bosmiya visits every site personally throughout the project. If you have a brief in mind, <a href="/contact">reach out</a> and we can have a conversation.</p>`
  },
  {
    id: 'home-design-vadodara',
    title: 'Designing a Home in Vadodara: Culture, Heritage, and the Modern Brief',
    excerpt: "Vadodara sits at the junction of heritage culture and a fast-moving real estate market. The homeowners here have specific ideas, and they are worth understanding.",
    coverImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    author: 'Ar. Vivek Bosmiya',
    date: '2026-08-08',
    category: 'Architecture',
    readTime: '5 min read',
    published: true,
    content: `<p>Vadodara is one of Gujarat's most culturally layered cities. The influence of the Gaekwad rulers left behind a city with Italianate palaces, strong fine arts institutions, and a population that has always had a relationship with aesthetics. That history shapes what Vadodara's homeowners ask for today, even if they cannot always articulate it directly.</p>

<h2>What makes designing for Vadodara different</h2>
<p>More than most Gujarat cities, Vadodara clients tend to have strong opinions about craft, materials, and detail. The city's architecture schools and fine arts culture have produced generations of people who notice when something is done well and notice equally when it is not. That is a useful quality in a client. It raises the standard of the work.</p>
<p>The city also has a significant stock of older homes, bungalows from the colonial period and havelis from earlier, that families want to restore or renovate without losing what makes them worth keeping. This is a specific kind of architectural problem, different from new construction, requiring a designer who understands both structural intervention and historical sensitivity.</p>

<h2>New construction in Vadodara's growing areas</h2>
<p>Sayajigunj, Gotri, Alkapuri, and the areas along the Vadodara-Anand corridor are seeing significant new residential construction. The challenge in these projects is different: creating homes that feel warm and specific in neighbourhoods that are still finding their character. Good residential design solves this by working from the inside out, starting with how the family lives rather than what the elevation will look like from the road.</p>

<h2>Questions worth raising early</h2>
<p>For a project in Vadodara, a few specific questions are worth raising before you commit to a designer:</p>
<ul>
  <li>What is your experience with local contractors and material suppliers in this region? The execution of design depends on the vendors, and familiarity with the local supply chain matters.</li>
  <li>How do you handle projects where you are not based locally? What matters is how the process is managed when the designer is not on site every day.</li>
  <li>What is your approach to Vastu, if any? Vadodara clients vary widely on this. A good designer will have a clear, honest answer rather than a hedge.</li>
</ul>

<h2>Working with studios from outside Vadodara</h2>
<p>VOAD is based in Rajkot and has worked on residential and commercial projects for clients across Gujarat. For projects in Vadodara, Ar. Vivek Bosmiya travels to site at key stages of design and construction. If you are planning a home or renovation in Vadodara and want to explore whether VOAD is a good fit, <a href="/contact">start a conversation here</a>.</p>`
  },
  {
    id: 'best-architecture-firm-rajkot',
    title: 'How to Find the Right Architecture Firm in Rajkot for Your Project',
    excerpt: "Rajkot has no shortage of architects and designers. The hard part is knowing which one will actually show up for your project. Here is how to tell.",
    coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    author: 'Ar. Vivek Bosmiya',
    date: '2026-08-06',
    category: 'Architecture',
    readTime: '6 min read',
    published: true,
    content: `<p>Rajkot has grown fast. The city that was primarily known for manufacturing and trading is now one of Gujarat's more ambitious urban centres, with new residential colonies, corporate parks, and a hospitality sector expanding to match. With that growth has come a significant increase in architecture and interior design firms operating here.</p>
<p>More choice is good, but it also makes the decision harder. Here is a practical way to think through it.</p>

<h2>First, clarify what kind of project you have</h2>
<p>Architecture and interior design cover a wide range, and not every firm is strong across all of it. A studio with a strong residential portfolio may not have the same command of commercial fitouts. A firm excellent at new construction may not be the right choice for heritage restoration or renovation.</p>
<p>Before you start calling around, write down the three things that matter most to you about the outcome. That list will help you ask better questions and read the answers more clearly.</p>

<h2>What a good first meeting looks like</h2>
<p>A serious architecture firm in Rajkot will spend at least as much time asking about you as it spends showing you its work. They should want to know how you live, how you use your home or office, who else will be part of the decision, and what has bothered you about spaces you have occupied before. A meeting that is mostly a presentation and a quote is not a good sign.</p>
<p>By the end of the meeting, you should have a clear sense of who will be handling your project day to day. In some firms, the principal presents but hands the work to junior team members. That is not necessarily wrong, but you should know going in.</p>

<h2>Understanding the fee structure</h2>
<p>Architecture fees in Rajkot are typically quoted as a percentage of construction cost, a fixed fee for the scope, or on a per-square-foot basis for interior work. Each model has tradeoffs.</p>
<p>Whatever the structure, ask what is included and what is not. Site supervision, structural drawings, electrical layouts, and furniture specifications are sometimes included and sometimes separate. Get clarity on this before you sign.</p>

<h2>VOAD's approach</h2>
<p>VOAD is a Rajkot-based studio led by Ar. Vivek Bosmiya. We work on residential architecture, luxury interior design, commercial projects, and heritage restoration. Every project is personally managed by Ar. Vivek from brief to handover. We do not run a large volume operation. The projects we take on, we take seriously.</p>
<p>If you are evaluating architecture firms in Rajkot and want to understand whether VOAD is a good fit for your brief, <a href="/contact">reach out here</a>. We are happy to have a conversation before you decide anything.</p>`
  },
  {
    id: 'residential-interior-gujarat',
    title: 'Residential Interior Design in Gujarat: What Works Here and Why',
    excerpt: "Designing homes in Gujarat is different from designing them in Delhi or Bangalore. The climate, the traditions, the family structures, all of it shapes what good interior design looks like here.",
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    author: 'Ar. Vivek Bosmiya',
    date: '2026-08-04',
    category: 'Interior Design',
    readTime: '6 min read',
    published: true,
    content: `<p>Designing homes in Gujarat is different from designing them in Delhi or Bangalore, and not only because of the climate. The way families live here, the weight given to tradition, the relationship between the home and the family's social world, all of it shapes what good interior design looks like. Applying ideas from other contexts without understanding this usually produces beautiful-looking spaces that do not actually work for the people in them.</p>

<h2>The Gujarati home and what it carries</h2>
<p>The pooja room is not optional. In most Gujarat homes, sacred space is not an afterthought tucked into a corner but a considered part of the house's structure. How it is positioned, how it is lit, and how it relates to the rest of the living area is an architectural question, not a decoration one.</p>
<p>Joint family structures are still common, even in urban Gujarat. A 3,000 square foot home may house three generations, which means the design needs to accommodate very different lifestyles: older family members who want quiet and familiarity, younger couples who want contemporary comfort, and children who need space to move. Getting this right requires thinking carefully about what is shared and what is private.</p>

<h2>Materials that work in Gujarat's climate</h2>
<p>Gujarat's summers are long and hot, and humidity varies significantly between coastal areas like Surat and the drier Saurashtra region around Rajkot and Jamnagar. Materials that hold up well in one context can fail in the other.</p>
<p>Natural stone, particularly Kota and local sandstones, ages well and keeps floors cooler. Marble works beautifully but requires maintenance in humid areas. Engineered wood performs better than solid wood in Gujarat's heat cycles. Heavy velvet and dense textiles that look warm and luxurious in a Mumbai showroom can feel suffocating in a Rajkot summer.</p>

<h2>Light and the Gujarat house</h2>
<p>The sun in Gujarat is strong enough that it is a design problem before it is a design asset. East and north-facing rooms get the best light. West-facing rooms need to be carefully considered, either shaded externally or given glazing that manages heat gain. The traditional Gujarat house handled this with deep verandahs, courtyards, and jaalis. Modern residential design often ignores these principles in favour of elevation, and the results show in utility bills and discomfort.</p>

<h2>Cities, contexts, and what changes</h2>
<p>Interior design across Gujarat is not one thing. A home in Ahmedabad's older parts has different constraints from a new villa in Gandhinagar or a coastal home near Dwarka. The high-rises going up in Surat need different treatment from traditional bungalows in Rajkot's older neighbourhoods. VOAD has worked in several of these contexts. Each one requires a different response, and the most important starting point is always the same: understanding the family before touching the design.</p>
<p>If you are planning a home in Gujarat and want to understand how we approach residential interior design, <a href="/contact">start a conversation with us here</a>. We work across the state and beyond.</p>`
  }
];

module.exports = async function handler(req, res) {
  if (req.query.secret !== 'voad-seed-2026') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    let blogs = await redis.get(KEY);
    if (!blogs || !Array.isArray(blogs)) blogs = [];

    const existingIds = new Set(blogs.map(b => b.id));
    const toAdd = NEW_BLOGS.filter(b => !existingIds.has(b.id));

    if (toAdd.length === 0) {
      return res.json({ ok: true, message: 'All blogs already exist', added: 0 });
    }

    const updated = [...toAdd, ...blogs];
    await redis.set(KEY, updated);

    return res.json({ ok: true, added: toAdd.length, ids: toAdd.map(b => b.id) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
