
import { Guest, Episode } from './types';

// Mock guests data
export const guests: Guest[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    title: 'AI Ethics Researcher',
    email: 'jane.smith@example.com',
    phone: '(555) 123-4567',
    bio: 'Dr. Jane Smith is a leading researcher in AI ethics and the impact of artificial intelligence on society. She has published numerous papers on responsible AI development and has advised several tech companies on ethical guidelines.',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith',
      website: 'https://janesmith.example.com'
    },
    notes: '<p>Jane is very knowledgeable about AI ethics and has a calm speaking style. She prefers tea over coffee.</p><ul><li>Speaks at a moderate pace</li><li>Very articulate about complex topics</li><li>Prefers philosophical questions over technical ones</li></ul>',
    backgroundResearch: '<p>Dr. Smith has published the following notable papers:</p><ol><li><strong>Ethical Considerations in AI Development</strong> (2022)</li><li><strong>The Social Impact of Machine Learning</strong> (2021)</li><li><strong>Responsible AI: A Framework</strong> (2020)</li></ol><p>She has appeared on several technology podcasts including TechTalk and Future Forward.</p>',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    title: 'Tech Entrepreneur',
    email: 'michael@startup.co',
    phone: '(555) 987-6543',
    bio: 'Michael Johnson is a serial entrepreneur who has founded three successful tech startups. His latest venture focuses on blockchain solutions for supply chain management.',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    socialLinks: {
      twitter: 'https://twitter.com/michaelj',
      linkedin: 'https://linkedin.com/in/michaelj',
      website: 'https://michaeljohnson.co'
    },
    notes: '<p>Michael speaks quickly and has lots of stories.</p><ul><li>Very enthusiastic about blockchain technology</li><li>Sometimes goes on tangents</li><li>Responds well to specific questions</li></ul><p>He\'s passionate about decentralized technologies.</p>',
    backgroundResearch: '<p>Michael\'s startups:</p><ol><li><strong>ChainTrack</strong> - Supply chain management using blockchain</li><li><strong>DataSecure</strong> - Acquired for $25M in 2019</li><li><strong>NetConnect</strong> - Early social networking platform</li></ol>',
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-02-10T10:15:00Z'
  },
  {
    id: '3',
    name: 'Dr. Lisa Chen',
    title: 'Quantum Computing Expert',
    email: 'lisa.chen@quantum.org',
    bio: 'Dr. Lisa Chen is at the forefront of quantum computing research. She leads a team developing new quantum algorithms that could revolutionize cryptography and computational chemistry.',
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/lisachen',
      website: 'https://lisachen.science'
    },
    notes: '<p>Lisa is brilliant at explaining complex topics in accessible ways.</p><ul><li>Breaks down quantum concepts with helpful analogies</li><li>Patient with technical questions</li><li>Prefers to be asked challenging questions</li></ul><p>She appreciates when you do your homework on quantum basics.</p>',
    backgroundResearch: '<p>Recent achievements:</p><ol><li><strong>Quantum Error Correction breakthrough</strong> (2023)</li><li><strong>Development of a new quantum algorithm for optimization problems</strong></li><li><strong>Collaboration with Major Tech Co. on quantum cryptography</strong></li></ol><p>She has received the Quantum Innovation Award in 2022.</p>',
    createdAt: '2023-03-05T14:30:00Z',
    updatedAt: '2023-03-05T14:30:00Z'
  }
];

// Mock episodes data
export const episodes: Episode[] = [
  {
    id: '1',
    episodeNumber: 1,
    title: 'The Ethics of Artificial Intelligence',
    scheduled: '2023-04-25T15:00:00Z',
    publishDate: '2023-05-02T12:00:00Z',
    status: 'published',
    guestIds: ['1'],
    introduction: 'In this episode, we explore the ethical considerations surrounding artificial intelligence with Dr. Jane Smith, a leading researcher in AI ethics.',
    topics: [
      {
        id: '1-1',
        title: 'Current state of AI regulation',
        notes: 'Discuss recent EU AI Act and how it compares to approaches in the US and China.'
      },
      {
        id: '1-2',
        title: 'Bias in AI systems',
        notes: 'Examples of algorithmic bias and methods to detect and mitigate it.'
      },
      {
        id: '1-3',
        title: 'Future of human-AI collaboration',
        notes: 'How can we design AI systems that augment human capabilities rather than replace them?'
      }
    ],
    notes: 'This was a fascinating conversation. Jane had great insights about the practical steps companies can take to implement ethical AI practices.',
    recordingLinks: {
      audio: 'https://example.com/podcasts/ai-ethics-episode.mp3',
      video: 'https://example.com/videos/ai-ethics-interview.mp4'
    },
    createdAt: '2023-03-10T09:00:00Z',
    updatedAt: '2023-04-26T16:30:00Z'
  },
  {
    id: '2',
    episodeNumber: 2,
    title: 'Entrepreneurship in Blockchain Technology',
    scheduled: '2023-05-18T14:00:00Z',
    publishDate: '2023-05-25T12:00:00Z',
    status: 'recorded',
    guestIds: ['2'],
    introduction: 'Join us for an exciting conversation with Michael Johnson, a serial entrepreneur who has founded multiple successful blockchain startups.',
    topics: [
      {
        id: '2-1',
        title: 'Journey into entrepreneurship',
        notes: 'Discuss Michael\'s background and what led him to start his first company.'
      },
      {
        id: '2-2',
        title: 'Blockchain use cases beyond cryptocurrency',
        notes: 'Supply chain, voting systems, digital identity - which have real potential?'
      },
      {
        id: '2-3',
        title: 'Fundraising tips for tech startups',
        notes: 'How Michael approached VCs and what he learned about pitching.'
      }
    ],
    notes: 'Michael was very energetic and shared some great stories about his failures as well as successes. We should edit down the tangent about his fishing hobby.',
    recordingLinks: {
      audio: 'https://example.com/podcasts/blockchain-episode.mp3',
      video: 'https://example.com/videos/blockchain-interview.mp4'
    },
    createdAt: '2023-04-05T11:30:00Z',
    updatedAt: '2023-05-19T10:00:00Z'
  },
  {
    id: '3',
    episodeNumber: 3,
    title: 'Quantum Computing: The Next Frontier',
    scheduled: '2023-06-10T13:00:00Z',
    publishDate: '2023-06-17T12:00:00Z',
    status: 'scheduled',
    guestIds: ['3'],
    introduction: 'Dr. Lisa Chen joins us to demystify quantum computing and discuss its potential to solve previously intractable problems in various fields.',
    topics: [
      {
        id: '3-1',
        title: 'Quantum computing basics',
        notes: 'Ask Lisa to explain qubits and quantum superposition in simple terms.'
      },
      {
        id: '3-2',
        title: 'Timeline for practical quantum applications',
        notes: 'When might we see quantum computers solving real-world problems?'
      },
      {
        id: '3-3',
        title: 'Quantum-resistant cryptography',
        notes: 'How should organizations prepare for a post-quantum world?'
      }
    ],
    notes: 'Prepare by reading Lisa\'s recent paper on quantum error correction. She mentioned she\'s excited to discuss new breakthroughs in quantum coherence.',
    createdAt: '2023-05-12T15:45:00Z',
    updatedAt: '2023-05-12T15:45:00Z'
  },
  {
    id: '4',
    episodeNumber: 4,
    title: 'Intersection of AI and Quantum Computing',
    scheduled: '2023-07-15T16:00:00Z',
    publishDate: '2023-07-22T12:00:00Z',
    status: 'scheduled',
    guestIds: ['1', '3'],
    introduction: 'In this special episode, we bring together Dr. Jane Smith and Dr. Lisa Chen to explore how artificial intelligence and quantum computing might converge in the coming years.',
    topics: [
      {
        id: '4-1',
        title: 'Quantum machine learning',
        notes: 'How quantum computing could accelerate AI training and inference.'
      },
      {
        id: '4-2',
        title: 'Ethical considerations of quantum AI',
        notes: 'New challenges that might arise from quantum-powered AI systems.'
      },
      {
        id: '4-3',
        title: 'Collaborative research opportunities',
        notes: 'Areas where researchers from both fields should work together.'
      }
    ],
    notes: 'This will be our first episode with two guests. Make sure to balance speaking time between Jane and Lisa.',
    createdAt: '2023-05-20T09:30:00Z',
    updatedAt: '2023-05-20T09:30:00Z'
  }
];
