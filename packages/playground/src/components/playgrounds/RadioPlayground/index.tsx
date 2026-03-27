import { Container, Radio } from '@heli-os/vallista-core'
import { FC } from 'react'

const RadioPlayground: FC = () => {
  return (
    <Container row>
      <Container center>
        <Radio.RadioGroup>
          <Container>
            <Container>
              <Radio.Radio value='col1'>Hello</Radio.Radio>
            </Container>
            <Container>
              <Radio.Radio value='col2'>World</Radio.Radio>
            </Container>
          </Container>
        </Radio.RadioGroup>
      </Container>
      <Container center>
        <Radio.RadioGroup disabled>
          <Container>
            <Container>
              <Radio.Radio value='col1'>Hello</Radio.Radio>
            </Container>
            <Container>
              <Radio.Radio value='col2'>World</Radio.Radio>
            </Container>
          </Container>
        </Radio.RadioGroup>
      </Container>
    </Container>
  )
}

export default RadioPlayground
