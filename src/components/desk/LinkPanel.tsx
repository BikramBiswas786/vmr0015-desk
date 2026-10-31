export function LinkPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-medium tracking-widest text-seal uppercase">Not connected</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">Guardian stays off</h2>
      </div>
      <p className="text-base leading-relaxed">
        Connecting this phone would send household answers to Guardian. That can print a play token. A play token is not money, and it is not a Verra serial.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        <li>The policy has to be published. The draft in pull request 6164 is not.</li>
        <li>A project owner needs an account. This notebook is not that owner.</li>
        <li>The numbers have to be from houses you saw, with a germ test. Those numbers are not here.</li>
      </ol>
      <p className="border border-rule bg-sheet px-3 py-3 text-sm leading-relaxed">
        <span className="font-medium text-seal">Not this. </span>
        There is no Connect button. A button that minted from this phone would be a lie.
      </p>
      <p className="text-sm leading-relaxed text-quiet">
        When an owner of a real project asks for the notebook, they connect Guardian on their side. You still do not press Mint.
      </p>
    </div>
  );
}
