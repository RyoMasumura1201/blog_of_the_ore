import Link from 'next/link'
const FirstPost: React.FC = () => {
    return (
        <>
            <h1>First Post</h1>
            <h2>
                <Link href="/">Home</Link>
            </h2>
        </>
    )
}

export default FirstPost