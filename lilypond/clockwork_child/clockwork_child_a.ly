% clockwork child, section A

child_a_one={
  \key a \major
  
  %1
  \fullcyclerest
  \break \bar "||"
  
  %2
  \fullcyclerest
  \break \bar "||"
  
  %3
  \fullcyclerest
  \break \bar "||"
  
  %4
  \fullcyclerest
  \break \bar "||"
  
  %5
  R1*2 |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''2 gis'' |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''8 b'' ais'' b'' ais''8 b'' ais'' b'' |
  \break \bar "||"
  
  %6
  c'''4. b''8 ais''4 b'' | ais''2 gis'' |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''2 gis'' |
  c'''4. b''8 ais''4 b'' | ais''1 |
  c'''4. b''8 ais''4 b'' | ais''8 b'' ais'' b'' ais''8 b'' ais'' b'' |
  \break \bar "||"
  
  %tumble
  ais''8 b'' ais'' b'' ais''8 b'' ais'' b''| 
  R1*2 |
  \break \bar "||"
}

clockwork_a_one={
  \key f \minor
  
  %1
  \fullcyclerest
  \break \bar "||"
  
  %2
  \fullcyclerest
  \break \bar "||"
  
  %3
  \repeat percent 3 {
    bes'4 r8 bes'4 r8 bes'4 | r8 bes'4 r8 bes'4 r8 bes'8~ | bes'8 r8 bes'4 r8 bes'4 r8 |
  }
  bes'8\< bes' bes' bes' bes' bes' bes' bes'\! |
  \break \bar "||"
  
  %4 5 6
  \repeat unfold 3 {
    \repeat percent 5 {
      bes'8[ aes' g'] bes'[ aes' g'] bes'[ aes' |
      g'8] bes'[ aes' g'] bes'[ aes' g' aes'] |
    }
    \break \bar "||"
  }
  
  %tumble
  g'8 aes' g' aes' g' aes' g' aes' |
  R1*2 |
  \break \bar "||"
}

fire_a_one={
  \key ees \minor
  
  %1
  \fullcyclerest
  \break \bar "||"
  
  %2
  \repeat percent 10 {
    bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
  }
  \break \bar "||"
   
  %3
  \repeat percent 3 {
    \repeat unfold 3 {
      bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
    }
  }
  bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
  \break \bar "||"
  
  %4 5 6
  \repeat unfold 3 {
    \repeat unfold 2 {
     <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r |
    }
    \repeat unfold 2 {
      <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r |
    }
    \repeat unfold 2 {
      <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r |
    }
    \repeat unfold 2 {
      <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r |
    }
    <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r |
    <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des'' e''>4-> |
    \break \bar "||"
  }
  
  %tumble
  ces''8 des'' ces'' des'' ces''8 des'' ces'' des'' | 
  R1*2 |
  \break \bar "||"
}

maker_a_one={
  \key cis \minor
          
  %1
  <e-0>8-"open string, detuning, retuning" e e e e e e e |
  \repeat tremolo 8 {e8_"sim."} |
  \repeat tremolo 8 {<dis-0>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e-0>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis-0>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<cis-0>8} | \repeat tremolo 8 {<dis-0>} |
  \break \bar "||"
  
  %2
  \repeat tremolo 8 {<e>8} |
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<cis-0>8-\markup{ "leave" \circle 6 "on C#"}} | \repeat tremolo 8 {<dis-2>} |
  \break \bar "||"
  
  %3
  \repeat tremolo 8 {<e-3>8} |
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {<dis-2>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
  \break \bar "||"
  
  %4
  \repeat tremolo 8 {<e>8} |
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
  \break \bar "||"
  
  %5
  \repeat tremolo 8 {<e>8} |
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
  \break \bar "||"
  
  %6
  \repeat tremolo 8 {<e>8} |
  \repeat tremolo 8 {e8} |
  \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
  \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
  \repeat tremolo 8 {<e-0>8_\markup{"back up to" \circle 6 "=E"}} | \repeat tremolo 8 {<e>} |
  \break \bar "||"
  
  %tumble
  e4_\markup {"pizz. B." \draw-dashed-line #'(5 . 0) }\staccato e\staccato e\staccato e\staccato |
  e16(f e8\staccato) r2. | R1 |
  \break \bar "||"
}