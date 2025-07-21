'use client';

import React, { useState, useEffect, useRef } from 'react';
import { commandHandler, CommandOutput } from '@/lib/commands';

interface HistoryItem {
  command: string;
  output: CommandOutput;
  timestamp: Date;
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show welcome message on load - different content for mobile vs desktop
    const getWelcomeMessage = () => {
      const isMobile = window.innerWidth < 768;
      
      const desktopWelcome = `┌─────────────────────────────────────────────────────────────────────────┐
│                      Welcome to CV Terminal v1.0                       │
│                         Ben Davies - Software Engineer                  │
└─────────────────────────────────────────────────────────────────────────┘

     ██████╗██╗   ██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
    ██╔════╝██║   ██║    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
    ██║     ██║   ██║       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
    ██║     ╚██╗ ██╔╝       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
    ╚██████╗ ╚████╔╝        ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
     ╚═════╝  ╚═══╝         ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

Interactive CV Terminal - Type 'help' for available commands
Last login: ${new Date().toLocaleString()} on ttys000

Ready for input...`;

      const mobileWelcome = `┌──────────────────────────────────────────┐
│         Welcome to CV Terminal v1.0      │
│       Ben Davies - Software Engineer     │
└──────────────────────────────────────────┘

 ██████╗██╗   ██╗
██╔════╝██║   ██║
██║     ██║   ██║
██║     ╚██╗ ██╔╝
╚██████╗ ╚████╔╝ 
 ╚═════╝  ╚═══╝  

████████╗███████╗██████╗ ███╗   ███╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
   ██║   █████╗  ██████╔╝██╔████╔██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝

Interactive CV Terminal
Type 'help' for available commands

Ready for input...`;

      return isMobile ? mobileWelcome : desktopWelcome;
    };

    const welcomeOutput: CommandOutput = {
      content: getWelcomeMessage(),
      type: 'info'
    };
    
    setHistory([{
      command: '',
      output: welcomeOutput,
      timestamp: new Date()
    }]);

    // Focus input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Handle window resize to update layout
    const handleResize = () => {
      // Force re-render on significant size changes
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when history updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Keep focus on input and handle touch events for mobile
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      // Prevent default touch behavior and focus input
      if (inputRef.current && e.target !== inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleTouch, { passive: false });
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim() || isLoading) return;
    
    const command = currentInput.trim();
    setCurrentInput('');
    setIsLoading(true);

    try {
      const output = await commandHandler.executeCommand(command);
      
      // Handle special clear command
      if (output.content === 'CLEAR_TERMINAL') {
        setHistory([]);
        setIsLoading(false);
        return;
      }
      
      const newHistoryItem: HistoryItem = {
        command,
        output,
        timestamp: new Date()
      };
      
      setHistory(prev => [...prev, newHistoryItem]);
    } catch (error) {
      const errorOutput: CommandOutput = {
        content: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      };
      
      setHistory(prev => [...prev, {
        command,
        output: errorOutput,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrompt = () => {
    return 'guest@cv-terminal:~$';
  };

  const getOutputColor = (type: CommandOutput['type']) => {
    switch (type) {
      case 'error':
        return 'text-terminal-error';
      case 'success':
        return 'text-terminal-success';
      case 'info':
      default:
        return 'text-terminal-text';
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4 md:p-4 sm:p-0">
      <div className="terminal-window w-full max-w-6xl h-[90vh] md:h-[90vh] sm:h-screen">
        {/* Terminal window header */}
        <div className="terminal-header px-4 py-3 flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-terminal-error shadow-lg"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-warning shadow-lg"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-success shadow-lg"></div>
          </div>
          <span className="text-terminal-comment text-sm font-bold hidden sm:inline">Terminal — bash — 80×24</span>
          <span className="text-terminal-comment text-xs font-bold sm:hidden">CV Terminal</span>
          <div className="ml-auto text-terminal-comment text-sm hidden sm:block">◐ ◑ ◒</div>
        </div>

        <div className="terminal-content flex flex-col h-full">
          <div 
            ref={terminalRef}
            className="flex-1 overflow-y-auto px-4 py-2 space-y-1 md:px-4 sm:px-2"
          >
            {/* Terminal History */}
            {history.map((item, index) => (
              <div key={index}>
                {item.command && (
                  <div className="terminal-line">
                    <span className="text-terminal-success font-bold">guest@cv-terminal</span>
                    <span className="text-terminal-text">:</span>
                    <span className="text-terminal-prompt">~</span>
                    <span className="text-terminal-text">$ </span>
                    <span className="text-terminal-text">{item.command}</span>
                  </div>
                )}
                <div className={`terminal-output whitespace-pre-wrap ${getOutputColor(item.output.type)} pl-0 mb-2 text-sm md:text-base overflow-x-auto`}>
                  {item.output.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="terminal-line">
                <span className="text-terminal-comment typing-animation">Processing...</span>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="px-4 py-2 border-t border-terminal-comment/20 bg-terminal-surface/50 md:px-4 sm:px-2">
            <form onSubmit={handleSubmit} className="terminal-line flex-nowrap">
              <span className="text-terminal-success font-bold">guest@cv-terminal</span>
              <span className="text-terminal-text">:</span>
              <span className="text-terminal-prompt">~</span>
              <span className="text-terminal-text">$ </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-terminal-text caret-terminal-text font-mono text-sm md:text-base min-w-0"
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
                style={{ textShadow: '0 0 3px currentColor' }}
              />
              <span className="terminal-cursor"></span>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}