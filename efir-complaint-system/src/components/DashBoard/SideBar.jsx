const SideBar = ({ select, onSelect }) => {
    const platforms = ['overview', 'complaints', 'new-complaint'];

    return (
        <div className="flex flex-col text-center text-lg bg-gradient-to-t from-purple-600 to-white">
            {platforms.map((x) => (
                <div
                    key={x}
                    onClick={() => onSelect(x)}
                    className={`flex flex-col items-center p-2 cursor-pointer
            ${select === x
                        ? "bg-purple-600 text-white"
                        : "bg-white hover:bg-purple-600 hover:text-white"}`}
                >
                    {x.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </div>
            ))}
        </div>
    );
};

export default SideBar;
