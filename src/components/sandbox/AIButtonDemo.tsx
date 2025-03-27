
import React, { useState, useEffect } from 'react';
import { AIGenerationDropdownButton, ContentVersion } from './AIGenerationDropdownButton';

export function AIButtonDemo() {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  
  // Mock versions for demo purposes
  const mockOptions = [
    {
      id: "1",
      label: "Option 1",
      version: "v1",
      date: "2023-06-15",
      source: "Manual Input" as const
    },
    {
      id: "2",
      label: "Option 2",
      version: "v2",
      date: "2023-06-16",
      source: "AI Generated" as const
    }
  ];

  // Prepopulated content versions for demonstration
  const prepopulatedVersions: ContentVersion[] = [
    {
      id: "version-1",
      content: "# Introduction to Podcasting\n\nPodcasting is a powerful medium that allows creators to reach audiences directly with audio content. Whether you're looking to share your expertise, tell stories, or build a community, podcasting offers a unique platform with relatively low barriers to entry.\n\n## Key Benefits\n\n- Direct connection with your audience\n- Freedom to explore topics in depth\n- Growing listener base across demographics\n- Flexibility in production and publishing",
      timestamp: "2023-01-10T12:00:00Z",
      source: 'manual',
      active: false,
      versionNumber: 1
    },
    {
      id: "version-2",
      content: "# Getting Started with Podcast Equipment\n\nOne of the most common questions new podcasters have is about equipment. While professional setups can be expensive, you can start with relatively affordable gear:\n\n- **Microphone**: USB microphone like Blue Yeti or Audio-Technica ATR2100\n- **Headphones**: Closed-back headphones to monitor audio\n- **Software**: Audacity (free) or Adobe Audition for editing\n- **Pop filter**: Reduces plosive sounds\n\nRemember that content quality matters more than perfect audio when starting out.",
      timestamp: "2023-02-15T14:30:00Z",
      source: 'ai',
      active: false,
      versionNumber: 2
    },
    {
      id: "version-3",
      content: "# Finding Your Podcast Niche\n\nThe podcasting landscape is vast and growing daily. To stand out, consider these strategies:\n\n1. Focus on a specific topic or audience\n2. Bring a unique perspective or format\n3. Consistency in publishing schedule\n4. Cross-promotion with complementary podcasts\n\nDon't try to appeal to everyone - the most successful podcasts often serve a well-defined audience extremely well rather than attempting to please everyone.",
      timestamp: "2023-03-20T09:15:00Z",
      source: 'ai',
      active: false,
      versionNumber: 3
    },
    {
      id: "version-4",
      content: "# Podcast Interview Techniques\n\nConversational podcasts rely heavily on the host's ability to conduct engaging interviews. Here are some proven techniques:\n\n- Research guests thoroughly beforehand\n- Prepare questions but allow for natural conversation flow\n- Listen actively rather than just waiting to ask the next question\n- Ask follow-up questions based on responses\n- Maintain a comfortable pace\n\nRemember that the best interviews feel like natural conversations, not interrogations.",
      timestamp: "2023-04-05T16:45:00Z",
      source: 'manual',
      active: false,
      versionNumber: 4
    },
    {
      id: "version-5",
      content: "# Podcast Distribution Strategies\n\nCreating great content is only half the battle - you also need to get it in front of listeners. Consider these distribution channels:\n\n- Major podcast platforms (Apple Podcasts, Spotify, Google Podcasts)\n- Your own website with embedded player\n- Social media promotion\n- Newsletter mentions\n- Guest appearances on other podcasts\n\nDon't forget to make it easy for listeners to subscribe and share your content.",
      timestamp: "2023-05-12T11:20:00Z",
      source: 'ai',
      active: false,
      versionNumber: 5
    },
    {
      id: "version-6",
      content: "# Monetizing Your Podcast\n\nWhile passion often drives podcasting, there are several ways to generate revenue:\n\n- **Sponsorships and advertising**: Partner with brands relevant to your audience\n- **Listener support**: Platforms like Patreon allow direct listener funding\n- **Premium content**: Exclusive episodes or content for paying subscribers\n- **Live events**: In-person or virtual events with ticket sales\n- **Merchandise**: Branded products for fans\n\nBuild your audience first - monetization becomes easier with a dedicated listenership.",
      timestamp: "2023-06-18T13:10:00Z",
      source: 'manual',
      active: false,
      versionNumber: 6
    },
    {
      id: "version-7",
      content: "# Podcast Production Workflow\n\nEfficient production processes save time and maintain quality:\n\n1. **Planning**: Topic research and outline development\n2. **Recording**: Capture high-quality audio in a controlled environment\n3. **Editing**: Remove mistakes, add music, and balance audio levels\n4. **Publishing**: Upload to hosting platform with compelling description\n5. **Promotion**: Share across channels to maximize reach\n\nDocumenting your workflow helps maintain consistency across episodes.",
      timestamp: "2023-07-22T10:05:00Z",
      source: 'ai',
      active: false,
      versionNumber: 7
    },
    {
      id: "version-8",
      content: "# Building a Podcast Community\n\nSuccessful podcasts often create communities around their content:\n\n- **Social media groups**: Dedicated spaces for listener discussion\n- **Comments and feedback**: Actively engage with listener messages\n- **Listener questions**: Incorporate audience questions into episodes\n- **Meetups**: Virtual or in-person gatherings of listeners\n\nA strong community provides both content ideas and word-of-mouth growth.",
      timestamp: "2023-08-30T15:40:00Z",
      source: 'imported',
      active: false,
      versionNumber: 8
    },
    {
      id: "version-9",
      content: "# Legal Considerations for Podcasters\n\nProtect yourself and your podcast by addressing these legal aspects:\n\n- **Copyright**: Understand rights for music, clips, and content use\n- **Release forms**: Get permission from guests for recording and distribution\n- **Disclosure**: Properly disclose affiliate relationships and sponsorships\n- **Privacy**: Handle listener data according to relevant regulations\n- **Business structure**: Consider forming an LLC or other entity\n\nConsult a legal professional for advice specific to your situation.",
      timestamp: "2023-09-14T08:25:00Z",
      source: 'manual',
      active: false,
      versionNumber: 9
    },
    {
      id: "version-10",
      content: "# Podcast Analytics and Growth\n\nUse data to inform your podcast strategy:\n\n- **Download metrics**: Track overall audience size and growth\n- **Listener demographics**: Understand who's listening\n- **Episode performance**: Identify your most popular content\n- **Drop-off points**: See where listeners stop playing\n- **Traffic sources**: Determine how people find your podcast\n\nRegularly review analytics to identify trends and opportunities for improvement.",
      timestamp: "2023-10-25T17:15:00Z",
      source: 'ai',
      active: false,
      versionNumber: 10
    },
    {
      id: "version-11",
      content: "# Podcast SEO Strategies\n\nHelp potential listeners discover your podcast:\n\n- **Episode titles**: Include relevant keywords naturally\n- **Show notes**: Comprehensive, searchable text companion to audio\n- **Transcripts**: Full text versions improve accessibility and searchability\n- **Website optimization**: Apply standard SEO best practices to your podcast website\n- **Internal linking**: Connect related episodes and content\n\nThink about what your ideal listener might search for when creating content.",
      timestamp: "2023-11-07T14:50:00Z",
      source: 'imported',
      active: false,
      versionNumber: 11
    },
    {
      id: "version-12",
      content: "# The Future of Podcasting\n\nStay ahead of these emerging trends:\n\n- **Video podcasting**: Visual components becoming increasingly common\n- **AI tools**: Transcription, editing, and distribution assistance\n- **Interactive elements**: Listener participation and feedback incorporation\n- **Specialized networks**: Niche-focused podcast collectives\n- **Smart speaker optimization**: Content designed for voice-first platforms\n\nThe podcasting medium continues to evolve - successful creators adapt with it.",
      timestamp: "2023-12-19T13:35:00Z",
      source: 'ai',
      active: true,
      versionNumber: 12
    }
  ];

  // Initialize with prepopulated versions
  useEffect(() => {
    // Sort versions in descending order by versionNumber (newest first)
    const sortedVersions = [...prepopulatedVersions].sort(
      (a, b) => b.versionNumber - a.versionNumber
    );
    
    setContentVersions(sortedVersions);
    
    // Set the content to the active version's content
    const activeVersion = sortedVersions.find(v => v.active);
    if (activeVersion) {
      setContent(activeVersion.content);
    }
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const newContent = `Generated content at ${new Date().toLocaleTimeString()}.\n\nThis is a demonstration of the AI generation component with version tracking.\n\nThe component can track multiple versions of content and allows switching between them.`;
      setContent(newContent);
      
      // Create a new version in the versions array
      const newVersion: ContentVersion = {
        id: `version-${Date.now()}`,
        content: newContent,
        timestamp: new Date().toISOString(),
        source: 'ai',
        active: true,
        versionNumber: contentVersions.length + 1
      };
      
      // Set other versions as inactive
      const updatedVersions = contentVersions.map(v => ({
        ...v,
        active: false
      }));
      
      setContentVersions([...updatedVersions, newVersion]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleOptionSelect = (option: any) => {
    console.log("Selected option:", option);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleClearAllVersions = () => {
    setContentVersions([]);
    setContent('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">AI Generation Button with Version History</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This component demonstrates the AI generation button with content versioning.
          Click "Generate" to create new content versions. Use the dropdown to switch between versions.
        </p>
        
        <AIGenerationDropdownButton
          buttonLabel="Generate"
          loadingLabel="Generating..."
          isGenerating={isGenerating}
          options={mockOptions}
          onButtonClick={handleGenerate}
          onOptionSelect={handleOptionSelect}
          onClearAllVersions={handleClearAllVersions}
          showNotification={true}
          editorContent={content}
          onEditorChange={handleContentChange}
          contentName="AI Generated Content"
          editorContentVersions={contentVersions}
          onContentVersionsChange={setContentVersions}
          hoverCardConfig={{
            aiProvider: "OpenAI",
            promptKey: "content-generation",
            promptTitle: "Standard Content Generator",
          }}
        />
      </div>
    </div>
  );
}
