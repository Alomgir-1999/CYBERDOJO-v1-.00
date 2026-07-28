import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Terminal, Shield, Award, HelpCircle, Key, Cpu } from 'lucide-react';
import { LabChallenge } from '../types';

interface TerminalConsoleProps {
  onChallengeComplete: (xpEarned: number, challengeTitle: string) => void;
  userXP: number;
}

const CHALLENGES: LabChallenge[] = [
  {
    id: 'lab-1',
    title: 'Linux Basics - File Navigation',
    difficulty: 'Easy',
    objective: 'Find the hidden flag inside the root file system of the target Linux box.',
    background: 'You have gained shell access to a remote host. Investigate the system files.',
    instructions: [
      'Type "ls" to list files in the current working directory.',
      'Read files using "cat <filename>".',
      'Look for a file named "flag.txt" or "secret.txt" and submit the flag using "submit <flag>".'
    ],
    expectedFlag: 'CD{L1NUX_B4S1CS_M4ST3RY}',
    rewardXP: 100,
    hint: 'ls listing will reveal files. One of them is secret.txt. Use "cat secret.txt" to read it.',
    hintCost: 20,
  },
  {
    id: 'lab-2',
    title: 'Cryptography Decryption Challenge',
    difficulty: 'Medium',
    objective: 'Decrypt the cipher message to reveal the secret passcode.',
    background: 'Intercepted communications show a rot13-encoded flag: "PQ{PELCGB_EBG13_HAFFXNoyR}"',
    instructions: [
      'The cipher uses standard ROT13 encoding (each letter shifted by 13 positions).',
      'Use the decryption command "decrypt rot13 PQ{PELCGB_EBG13_HAFFXNoyR}" to decode it.',
      'Submit using "submit <decrypted_value>".'
    ],
    expectedFlag: 'CD{CRYPTO_ROT13_UNSSKable}',
    rewardXP: 150,
    hint: 'Execute the command "decrypt rot13 PQ{PELCGB_EBG13_HAFFXNoyR}" in the terminal.',
    hintCost: 30,
  },
  {
    id: 'lab-3',
    title: 'SQL Injection Vulnerability Sandbox',
    difficulty: 'Hard',
    objective: 'Bypass the portal login screen using a SQL injection payload.',
    background: 'A dummy portal is running on http://cyberdojo.local/portal. It takes raw database queries.',
    instructions: [
      'Type "sqlmap --test-login" to probe the login parameters.',
      'Use a SQL Injection payload to bypass authentication. Type "sqlmap --payload" to see available options.',
      'Type "sqlmap --inject-payload \\"\' OR 1=1 --\\"" to compromise the database.',
      'Submit the compromised server flag using "submit <compromised_flag>".'
    ],
    expectedFlag: 'CD{SQL1_BYP4SS_SUCC3SS}',
    rewardXP: 200,
    hint: 'Run "sqlmap --inject-payload "\' OR 1=1 --"" to print the flag directly from the backend.',
    hintCost: 50,
  }
];

export default function TerminalConsole({ onChallengeComplete, userXP }: TerminalConsoleProps) {
  const [selectedLabIdx, setSelectedLabIdx] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<string[]>([
    'Welcome to CYBERDOJO Sandbox Terminal v2.10',
    'System status: SECURE. Isolated container activated.',
    'Type "help" to see available commands, or solve the mission on the left.',
    ''
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeLab = CHALLENGES[selectedLabIdx];

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to commands history
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);

    const parts = trimmed.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: string[] = [`visitor@cyberdojo:~$ ${trimmed}`];

    switch (mainCommand) {
      case 'help':
        output.push(
          'Available Commands:',
          '  help                         - Show this help sheet',
          '  clear                        - Clear the screen buffer',
          '  whoami                       - Print current shell user',
          '  ls                           - List files in current directory',
          '  cat <filename>               - Read the content of a file',
          '  decrypt <type> <text>        - Cryptographic helper (e.g., decrypt rot13 <text>)',
          '  sqlmap <arguments>           - SQL vulnerability testing tool',
          '  hint                         - Unlock active lab hint (reduces XP)',
          '  submit <flag>                - Submit discovered flag to unlock next level'
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'whoami':
        output.push('visitor_dojo_warrior');
        break;

      case 'ls':
        if (activeLab.id === 'lab-1') {
          output.push('notes.txt    config.ini    secret.txt    user_profile.json');
        } else if (activeLab.id === 'lab-2') {
          output.push('crypt_instructions.md    intercepted_hash.enc');
        } else {
          output.push('index.php    db_config.php    admin_portal.php');
        }
        break;

      case 'cat':
        if (args.length === 0) {
          output.push('Error: cat requires a file name parameter (e.g., "cat notes.txt")');
        } else {
          const filename = args[0].toLowerCase();
          if (activeLab.id === 'lab-1') {
            if (filename === 'secret.txt') {
              output.push(`[CONFIDENTIAL FILE] FLAG: ${activeLab.expectedFlag}`);
            } else if (filename === 'notes.txt') {
              output.push('Testing notes: Host seems secure. Added secret.txt for safe keeping.');
            } else {
              output.push(`Error: File "${args[0]}" not found or permissions denied.`);
            }
          } else if (activeLab.id === 'lab-2') {
            if (filename === 'crypt_instructions.md') {
              output.push('Decode the rot13 string to uncover the secret passcode. Submit code as flag.');
            } else if (filename === 'intercepted_hash.enc') {
              output.push('Interpreted payload string: "PQ{PELCGB_EBG13_HAFFXNoyR}"');
            } else {
              output.push(`Error: File "${args[0]}" not found.`);
            }
          } else {
            output.push('Error: Permission Denied. You do not have write/read permission on ' + args[0]);
          }
        }
        break;

      case 'decrypt':
        if (args.length < 2) {
          output.push('Usage: decrypt <type> <text>', 'Example: decrypt rot13 ciphertext');
        } else {
          const type = args[0].toLowerCase();
          const text = args.slice(1).join(' ');
          if (type === 'rot13') {
            const rot13Decrypted = text.replace(/[a-zA-Z]/g, (c) => {
              const code = c.charCodeAt(0);
              const start = code >= 97 ? 97 : 65;
              return String.fromCharCode(((code - start + 13) % 26) + start);
            });
            output.push(`Decrypted text (ROT13): ${rot13Decrypted}`);
          } else {
            output.push(`Error: Decryption algorithm "${type}" unsupported. Use "rot13".`);
          }
        }
        break;

      case 'sqlmap':
        if (args.length === 0) {
          output.push('Usage: sqlmap <arguments>', 'Try "sqlmap --test-login" or "sqlmap --payload"');
        } else {
          const option = args[0];
          if (option === '--test-login') {
            output.push(
              'SQLMAP probing URL: http://cyberdojo.local/portal',
              'Checking parameters: [user, pass]',
              'Status: Parameter "user" appears vulnerable to SQL Injection.'
            );
          } else if (option === '--payload') {
            output.push(
              'Recommended injection payloads:',
              '  "\' OR 1=1 --"',
              '  "\' UNION SELECT username, password FROM users --"'
            );
          } else if (option === '--inject-payload') {
            const payload = args.slice(1).join(' ').replace(/['""]/g, '');
            if (payload === "' OR 1=1 --" || payload === 'OR 1=1 --' || payload.includes('1=1')) {
              output.push(
                'Injecting SQL payload...',
                'Database compromised successfully!',
                `Compromised system dump: FLAG discovered -> ${activeLab.expectedFlag}`
              );
            } else {
              output.push(
                'Injecting payload: ' + payload,
                'Status code 200: Login failed. Wrong credentials.'
              );
            }
          } else {
            output.push(`sqlmap: unrecognised parameter "${option}". Try "sqlmap --test-login"`);
          }
        }
        break;

      case 'hint':
        if (userXP < activeLab.hintCost) {
          output.push(`Error: You need at least ${activeLab.hintCost} XP to unlock this hint. Current: ${userXP} XP.`);
        } else {
          output.push(`💡 HINT (Cost: ${activeLab.hintCost} XP): ${activeLab.hint}`);
        }
        break;

      case 'submit':
        if (args.length === 0) {
          output.push('Error: submit requires a flag argument (e.g., "submit CD{...}")');
        } else {
          const submittedFlag = args[0];
          if (submittedFlag === activeLab.expectedFlag) {
            output.push(
              '🏆 SUCCESS! Correct flag submitted.',
              `Rewarded: +${activeLab.rewardXP} XP!`,
              'Level unlocked! Select another mission to keep defending.'
            );
            if (!completedLabs.includes(activeLab.id)) {
              setCompletedLabs((prev) => [...prev, activeLab.id]);
              onChallengeComplete(activeLab.rewardXP, activeLab.title);
            }
          } else {
            output.push('❌ INVALID FLAG! Check spelling or try investigating deeper.');
          }
        }
        break;

      default:
        output.push(`cyberdojo: command not found: "${mainCommand}". Type "help" for a list of commands.`);
    }

    setHistory((prev) => [...prev, ...output, '']);
    setInputVal('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const selectLab = (idx: number) => {
    setSelectedLabIdx(idx);
    setHistory((prev) => [
      ...prev,
      `--- Switched to Lab: ${CHALLENGES[idx].title} ---`,
      `Objective: ${CHALLENGES[idx].objective}`,
      ''
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Challenges & Instructions */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="border border-[#1f2937] bg-[#0d1117]/95 rounded-xl p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-[#00d4ff]" />
            <span className="font-head font-bold text-sm tracking-wider text-white">SELECT CYBER LAB</span>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {CHALLENGES.map((lab, idx) => {
              const isCompleted = completedLabs.includes(lab.id);
              return (
                <button
                  key={lab.id}
                  onClick={() => selectLab(idx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    selectedLabIdx === idx
                      ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-white'
                      : 'border-[#1f2937] bg-white/5 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-xs text-white">{lab.title}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        lab.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : lab.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {lab.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-500 line-clamp-1">{lab.objective}</span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> COMPLETED
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lab Specifications */}
          <div className="border-t border-[#1f2937] pt-4 mt-2">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-xs text-[#8b5cf6] font-head tracking-wider">LAB OBJECTIVE</span>
              <span className="text-xs font-mono text-[#00ff88]">+{activeLab.rewardXP} XP</span>
            </div>
            <p className="text-xs text-gray-300 mb-3">{activeLab.background}</p>

            <span className="font-semibold text-xs text-[#00d4ff] font-head tracking-wider block mb-2">INSTRUCTIONS</span>
            <ol className="list-decimal pl-4 flex flex-col gap-1.5 text-[11px] text-gray-400">
              {activeLab.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ol>

            <button
              onClick={() => handleCommand('hint')}
              className="mt-4 flex items-center justify-center gap-1 w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all"
            >
              <HelpCircle className="w-4 h-4" /> REVEAL HINT (COST: {activeLab.hintCost} XP)
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="lg:col-span-3 flex flex-col h-[420px] rounded-xl border border-[#1f2937] bg-black/90 p-4 font-mono text-sm overflow-hidden relative shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#1f2937] pb-2 mb-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
          </div>
          <span className="text-[10px] text-cyan-400 tracking-wider font-head uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> CYBERDOJO INTERACTIVE TERMINAL
          </span>
          <span className="text-[10px] text-gray-600">bash 5.0</span>
        </div>

        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.3))] z-20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/10 opacity-30 animate-scan z-20 pointer-events-none" />

        {/* Screen Content */}
        <div
          onClick={handleTerminalClick}
          className="flex-1 overflow-y-auto overflow-x-hidden pr-2 flex flex-col gap-1 text-[#00ff88] text-xs leading-relaxed font-mono cursor-text"
        >
          {history.map((line, i) => {
            if (line.startsWith('visitor@cyberdojo:~$')) {
              return (
                <div key={i} className="text-cyan-400 font-semibold mt-1">
                  {line}
                </div>
              );
            }
            if (line.startsWith('❌') || line.startsWith('Error:')) {
              return (
                <div key={i} className="text-rose-400">
                  {line}
                </div>
              );
            }
            if (line.startsWith('🏆') || line.startsWith('💡')) {
              return (
                <div key={i} className="text-amber-400 font-bold">
                  {line}
                </div>
              );
            }
            return <div key={i}>{line}</div>;
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Area */}
        <div className="flex items-center gap-2 border-t border-[#1f2937] pt-2 mt-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400 font-semibold text-xs">visitor@cyberdojo:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#00ff88] text-xs font-mono"
            placeholder="Type a command (e.g., 'help')..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
