const MessageContainer = ({ messages }) => {

    return <div>
        <table>
            <tbody>
                {
                    messages && messages.map((message, index) => {
                        return <tr key={index}>
                            <td>{message.message} - {message.username}</td>
                        </tr>

                    })
                }
                {
                    !messages && <h3>There are no messages yet.</h3>
                }
            </tbody>
        </table>
    </div>;

}

export default MessageContainer;