% clockwork child, section B

child_b_two={
  %1
  R1*3 |
  R1*2 | r2.. e'''16 e''' |
  \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*4 | r2.. e'''16 e''' |
  \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*4 | r2.. e'''16 e''' |
  \solobreak \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*4 | r2.. e'''16 e''' |
  \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*5 |
  \solobreak \combinedbreak \bar "||" 
}

clockwork_b_one={
  %1
  R1*6 |
  \combinedbreak \bar "||"
  
  \repeat unfold 4 {
    \repeat percent 3 {
      cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
    }
    \repeat percent 3 {
      cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
    }
    \combinedbreak \bar "||"
    \solobreak
  }
}

fire_b_one={
  %1
  R1*6 |
  
  \repeat percent 3 {
    bes'4_\markup {"pizz." \draw-dashed-line #'(5 . 0)}\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \repeat percent 3 {
    bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \combinedbreak \bar "||"
  
  \repeat unfold 2 {
    \repeat percent 3 {
      bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
    }
    \repeat percent 3 {
      bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
    }
    \combinedbreak \bar "||"
    \solobreak
  }
  
  \repeat percent 3 {
    bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \repeat percent 2 {
    bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \combinedbreak \bar "||"
  bes'8 bes' bes' bes' bes' bes' bes' bes' |
  \combinedbreak \bar "||"
  \break
}

maker_b_one={
  %1
  e4_\markup {"pizz." \draw-dashed-line #'(5 . 0) }\staccato e\staccato e\staccato e\staccato | 
  e4\staccato r2. |
  R1 |
  e4\staccato e\staccato e\staccato e\staccato | 
  e4\staccato r2. |
  R1 |
  \combinedbreak \bar "||"
  
  \repeat percent 2 {
    e4\staccato e\staccato e\staccato e\staccato | 
    e4\staccato r2. |
    R1 |
  }
  \combinedbreak \bar "||"
  
  \repeat percent 2 {
    e4\staccato e\staccato e\staccato e\staccato | 
    e4\staccato r2. |
    R1 |
  }
  \combinedbreak \bar "||"
  
  \repeat percent 2 {
    e4\staccato e\staccato e\staccato e\staccato | 
    fis4\staccato fis\staccato fis\staccato fis\staccato |
    g4\staccato g\staccato g\staccato g\staccato |
  }
  \combinedbreak \bar "||"
  
  \repeat percent 2 {
    e4_"nat." e e e | 
    fis4 fis fis fis |
    g4 g g g |
  }
  \combinedbreak \bar "||"
}