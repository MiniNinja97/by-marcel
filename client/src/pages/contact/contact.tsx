import './contact.css';

export default function Contact () {
    return (
        <div className='contact'>

            <div className='contact-intro'>
                <h2>Kontakt</h2>
                <p>Har du frågor om en produkt, vill göra en specialbeställning eller bara vill säga hej? Fyll i formuläret så återkommer vi så snart som möjligt.</p>
            </div>

            <div className='contact-layout'>

                <form className='contact-form'>
                    <div className='form-row'>
                        <div className='form-group'>
                            <label>Förnamn</label>
                            <input type='text' placeholder='Anna' />
                        </div>
                        <div className='form-group'>
                            <label>Efternamn</label>
                            <input type='text' placeholder='Lindberg' />
                        </div>
                    </div>

                    <div className='form-group'>
                        <label>E-post</label>
                        <input type='email' placeholder='anna@exempel.se' />
                    </div>

                    <div className='form-group'>
                        <label>Ämne</label>
                        <select>
                            <option value='' disabled>Välj ämne</option>
                            <option>Fråga om produkt</option>
                            <option>Specialbeställning</option>
                            <option>Order & leverans</option>
                            <option>Övrigt</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Meddelande</label>
                        <textarea placeholder='Skriv ditt meddelande här...' />
                    </div>

                    <button type='submit'>Skicka meddelande</button>
                </form>

                <div className='contact-info'>
                    <div className='info-box'>
                        <p className='info-label'>E-post</p>
                        <h4>hej@bymarcel.se</h4>
                        <p className='info-sub'>Vi återkommer så snart som möjligt </p>
                    </div>
                    <div className='info-box'>
                        <p className='info-label'>Instagram</p>
                        <h4>@bymarcel</h4>
                        <p className='info-sub'>Följ oss för nyheter och inspiration</p>
                    </div>
                    <div className='info-box'>
                        <p className='info-label'>E-post</p>
                        <h4>contact@empost.com</h4>
                        <p className='info-sub'>Infotext</p>
                    </div>
                </div>

            </div>
        </div>
    )
}