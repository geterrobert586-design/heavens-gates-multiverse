import React from "react";

export default function CopyrightNotice() {
  return (
    <div className="border-t border-border/30 mt-8 pt-4 pb-2 px-4">
      <p className="font-heading text-[9px] tracking-[0.15em] text-muted-foreground/50 uppercase text-center leading-relaxed">
        © 2026 Robert Leon Geter II · All Rights Reserved · Heavens Gates Chronicles
      </p>
      <p className="text-[9px] text-muted-foreground/30 text-center mt-1 leading-relaxed max-w-lg mx-auto">
        No part of this publication may be reproduced, stored, or transmitted in any form without prior written permission.
        This is a work of fiction. Any resemblance to actual persons or events is coincidental or used in a transformed literary sense.
      </p>
    </div>
  );
}